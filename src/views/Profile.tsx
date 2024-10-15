import React, { useEffect } from 'react'
import { zorkin } from '../lib'
import toast from 'react-hot-toast'
import algosdk from 'algosdk'
import { useNavigate } from 'react-router-dom'
import { algod } from '../lib/algod'
import { Spinner } from '../components'

interface TX {
  id: string
}
const handleTxViewClick = (id: string) => {
  window.open(`https://testnet.explorer.perawallet.app/tx/${id}`, '_blank', 'noopener,noreferrer');
};

const Table = ({ items }: { items: TX[] }): JSX.Element => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
              TxId
            </th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((tx) => (
            <tr key={tx.id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {tx.id}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                <a
                  onClick={() => handleTxViewClick(tx.id)}
                  className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs cursor-pointer font-medium text-white hover:bg-indigo-700"
                >
                  View
                </a>

              </td>
            </tr>))}
        </tbody>
      </table>
    </div>
  )
}

const Profile = (): JSX.Element => {
  const navigate = useNavigate()
  const [items, setItems] = React.useState<TX[]>([])
  const [balance, setBalance] = React.useState<number>(0)
  const [addr, setAddr] = React.useState<string>()
  const [balanceLoading, setBalanceLoading] = React.useState<boolean>(true)

  const getBalance = async (addr: string): Promise<number> => {
    const balance = await algod.accountInformation(addr).do()
    return balance.amount
  }
  useEffect(() => {
    toastify('Loading account', async () => {
      const addr = await zorkin.getAddress()
      setAddr(addr)
      await updateBalance(addr)
    })
  }, [])

  const logout = async (): Promise<void> => {
    navigate('/')
  }

  const selfPayment = async (): Promise<void> => {
    if (addr === undefined) {
      toast.error('Error getting address')
      throw new Error('Error getting address')
    }

    toastify('Signing & Sending TX', async () => {
      if (addr === undefined) {
        toast.error('Error getting address')
        throw new Error('Error getting address')
      }
      // create self send tx
      const suggestedParams = await algod.getTransactionParams().do()
      const tx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: addr,
        to: addr,
        amount: 0,
        suggestedParams
      })
      const lease = new Uint8Array(32);
      crypto.getRandomValues(lease);
      tx.addLease(lease)
      const txId = await zorkin.sign(tx)
      setItems([...items, { id: txId }])
      await updateBalance()
    })
  }
  const toastify = async (msg: string, callback: () => Promise<void>) => {
    const toastId = toast.loading(msg, { duration: 300000, style: { background: '#F0FDFE', maxWidth: '400px' } })
    try {
      await callback()
    } catch (e) {
      toast.error('Error sending transaction')
    }
    toast.remove(toastId)
    toast.success(msg, { duration: 2000 })
  }
  const payForAnItem = async (): Promise<void> => {
    toastify('Signing & Sending TX', async () => {
      if (addr === undefined) {
        toast.error('Error getting address')
        throw new Error('Error getting address')
      }
      // create self send tx
      const suggestedParams = await algod.getTransactionParams().do()
      const tx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: addr,
        to: 'II2WBHGR7BVFTFJEAG7HHIFH7FVCSLG63ITJSKG453R3U44R6YSI3SG2HY',
        amount: 100_000,
        suggestedParams
      })
      const lease = new Uint8Array(32);
      crypto.getRandomValues(lease);
      tx.addLease(lease)
      const txId = await zorkin.sign(tx)
      setItems([...items, { id: txId }])
      await updateBalance()
    })
  }

  const updateBalance = async (overrideAddr?: string) => {
    const address = addr ?? overrideAddr;
    if (address === undefined) {
      return;
    }

    const checkBalance = async () => {
      const newBalance = await getBalance(address);
      setBalance((currentBalance) => {
        // If the balance has changed, update it and clear the interval
        if (currentBalance !== newBalance || overrideAddr !== undefined) {
          clearInterval(balanceInterval);
          setBalanceLoading(false)
          return newBalance;
        }
        // Return the current balance to keep the interval running
        return currentBalance;
      });
    };
    setBalanceLoading(true)
    // Set the interval to check the balance every second
    const balanceInterval = setInterval(checkBalance, 1000);
  };

  const fund = async (): Promise<void> => {
    toastify('Funding Account', async () => {
      if (addr === undefined) {
        toast.error('Error getting address')
        return
      }
      await zorkin.fundAccountForDemo()
      await updateBalance()
    })
  }

  const onramp = async (): Promise<void> => {
    await zorkin.onramp()
  }

  return (
    <>
      <nav className="bg-white flex w-full justify-between items-center shadow-lg mb-10">
        {/* A left justified title saying "Profile" */}
        <div className="flex items-center justify-between h-16 w-full px-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <p className="text-2xl font-bold text-gray-800 ">
                Profile
              </p>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              onClick={() => {
                void logout()
              }}
            >
              Logout
            </button>
          </div>
        </div>
        {/* A right justified logout button */}
      </nav>
      <main className="w-full flex flex-col items-center justify-center px-4">
        <div className="items-center w-full bg-white my-5 space-y-5 max-w-2xl">
          <h2>Details</h2>
          <article className="rounded-lg border border-gray-300 bg-white p-6">
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-md font-medium text-gray-900">{addr}</p>
            </div>
          </article>
          <article className="rounded-lg border border-gray-300 bg-white p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Balance (microALGO)</p>
              <p className="text-lg font-medium text-gray-900">{balance}</p>
            </div>
            {balanceLoading && <Spinner />}
          </article>
          <h2>Fund Account</h2>
          <a
            className="inline-flex items-center between gap-2 cursor-pointer rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            onClick={() => {
              fund()
                .then(() => { })
                .catch(() => { })
            }}
          >
            <span className="text-sm font-medium"> Fund Account </span>
          </a>
          <h2>On-Ramp</h2>
          <a
            className="inline-flex items-center between gap-2 cursor-pointer rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            onClick={() => {
              onramp()
                .then(() => { })
                .catch(() => { })
            }}
          >
            <span className="text-sm font-medium">On-Ramp</span>
          </a>
          <h2>Test Transaction</h2>
          <article className="rounded-lg border border-gray-300 bg-white p-6">
            <div>
              <p className="text-sm text-gray-500 ">Type of Transaction</p>
              <div className="text-lg font-medium text-gray-900 flex justify-between items-center">
                <p>Self-Payment of 0</p>
                <a
                  className="inline-flex items-center cursor-pointer between gap-2 rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                  onClick={() => {
                    selfPayment()
                      .then(() => { })
                      .catch(() => { })
                  }}
                >
                  <span className="text-sm font-medium"> Sign </span>
                  <svg
                    className="h-5 w-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>
          <article className="rounded-lg border border-gray-300 bg-white p-6">
            <div>
              <p className="text-sm text-gray-500 ">Type of Transaction</p>
              <div className="text-lg font-medium text-gray-900 flex justify-between items-center">
                <p>Pay for an item (0.1A)</p>
                <a
                  className="inline-flex items-center cursor-pointer between gap-2 rounded border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                  onClick={() => {
                    payForAnItem()
                      .then(() => { })
                      .catch(() => { })
                  }}
                >
                  <span className="text-sm font-medium"> Sign </span>
                  <svg
                    className="h-5 w-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          <h2>Transactions</h2>
          <Table items={items} />
        </div>
      </main>
    </>
  )
}

export default Profile
