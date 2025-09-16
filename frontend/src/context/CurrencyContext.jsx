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
    if (!amount || isNaN(amount)) return `${currencySymbols[currency]}0.00`

    // Always convert from INR to selected currency
    const convertedAmount = amount * exchangeRate
    const symbol = currencySymbols[currency]

    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount)
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