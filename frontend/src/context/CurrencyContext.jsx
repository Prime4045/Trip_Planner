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
    USD: 0.012, // 1 INR = 0.012 USD
    EUR: 0.011, // 1 INR = 0.011 EUR
    GBP: 0.0095 // 1 INR = 0.0095 GBP
  }

  // Currency symbols mapping
  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  }

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('preferred-currency')
    if (savedCurrency && Object.keys(exchangeRates).includes(savedCurrency)) {
      setCurrency(savedCurrency)
      setExchangeRate(exchangeRates[savedCurrency])
    }
  }, [])

  const changeCurrency = (newCurrency) => {
    if (Object.keys(exchangeRates).includes(newCurrency)) {
      setCurrency(newCurrency)
      setExchangeRate(exchangeRates[newCurrency])
      localStorage.setItem('preferred-currency', newCurrency)
    }
  }

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0'
    
    const convertedAmount = currency === 'INR' ? amount : amount * exchangeRate
    const symbol = currencySymbols[currency]
    
    if (currency === 'INR') {
      return `${symbol}${Math.round(convertedAmount).toLocaleString('en-IN')}`
    } else {
      return `${symbol}${convertedAmount.toFixed(2)}`
    }
  }

  const getCurrencySymbol = () => {
    return currencySymbols[currency] || '₹'
  }

  const value = {
    currency,
    exchangeRate,
    changeCurrency,
    formatCurrency,
    getCurrencySymbol,
    currencySymbols
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}