import GenericContract from "@contracts/GenericContract"
import { parseBigNumberToInt } from "@utils/parseUtils"

class Distributor extends GenericContract {
  async nextEpochBlock() {
    const index = await this.contract.nextEpochBlock()
    const formattedEpoch = parseBigNumberToInt(index)
    return formattedEpoch
  }
}

export default Distributor
