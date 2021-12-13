export function prettify(money: number) {
  return format(round(money, 2), 3)
}

export function round(money: number, decimal: number) {
  let round = 1 * Math.pow(10, decimal)
  money = Math.round(money * round) / round
  return money
}

export function format(money: number, decimal: number) {
  if (!money) return 0
  if (decimal) {
    money = round(money, decimal)
  }
  const moneyString = money.toString().split(".")
  moneyString[0] = moneyString[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  if (moneyString[1]) {
    return moneyString[0] + "." + moneyString[1]
  } else {
    return moneyString[0]
  }
}
