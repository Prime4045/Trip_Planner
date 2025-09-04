import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR')
  const [exchangeRate, setExchangeRate] = useState(1)

  // Exchange rates (approximate)
  const exchangeRates = {
    INR: 1,
    USD: 0.012 // 1 INR = 0.012 USD (approximate)
  }

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('preferred-currency')
    if (savedCurrency && ['INR', 'USD'].includes(savedCurrency)) {
      setCurrency(savedCurrency)
      setExchangeRate(exchangeRates[savedCurrency])
    }
  }, [])

  const changeCurrency = (newCurrency) => {
    if (['INR', 'USD'].includes(newCurrency)) {
      setCurrency(newCurrency)
      setExchangeRate(exchangeRates[newCurrency])
      localStorage.setItem('preferred-currency', newCurrency)
    }
  }

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'N/A'
    
    const convertedAmount = currency === 'USD' ? amount * exchangeRate : amount
    
    if (currency === 'USD') {
      return `$${convertedAmount.toFixed(2)}`
    } else {
      return `₹${Math.round(convertedAmount).toLocaleString('en-IN')}`
    }
  }

  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : '₹'
  }

  const value = {
    currency,
    exchangeRate,
    changeCurrency,
    formatCurrency,
    getCurrencySymbol
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}