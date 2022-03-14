import GenericContract from "./GenericContract"

class BondCalculator extends GenericContract {
  async valuation(address: string, amount: number) {
    return await this.contract.valuation(address, amount)
  }

  async markdown(address: string) {
    return await this.contract.markdown(address)
  }
}

export default BondCalculator
