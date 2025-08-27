// components/CurrencySwitcher.js
import { useCurrency } from "../context/CurrencyContext";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="currency-switcher"
    >
      <option value="USD">$ USD</option>
      <option value="NGN">₦ NGN</option>
      <option value="EUR">€ EUR</option>
    </select>
  );
}
