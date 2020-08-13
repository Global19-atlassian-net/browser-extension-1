import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { ProgramDecoder } from "./types"
import { SolanaDecoder } from "./layouts/solana"
import { createLogger } from "../utils"
import { SplDecoder } from "./layouts/spl"
import { Web3Connection } from "../connection"
import { InstructionDetails } from "../types"

const log = createLogger("sol:decoder")
const supportedProgramId = new Map<string, ProgramDecoder>()

export class Decoder {
  private supportedProgramId: Map<string, ProgramDecoder>
  private connection: Web3Connection

  constructor(connection: Web3Connection) {
    this.supportedProgramId = new Map<string, ProgramDecoder>()
    this.connection = connection
    this._setupDecoders()
  }

  decode = async (transaction: Transaction): Promise<((InstructionDetails | undefined)[])> => {
		const decodeInstruction = (instruction:TransactionInstruction):Promise<InstructionDetails | undefined> => {
  		return new Promise<InstructionDetails | undefined>((resolve, reject) => {
				const programId = instruction.programId
				log("Finding decoder for programId: %s", programId.toBase58())
				const decoder = this._getDecoder(instruction.programId)

				if (decoder == undefined) {
					//TODO: Maybe add support to skip unknown instructions and put a placeholder type instead
					log("Unable to retrieve decoder for programId: %s", programId.toBase58())
					resolve(undefined)
					return
				}

				log("Decoding transaction for programId : %s", programId.toBase58())
				decoder.decodeInstruction(this.connection, instruction).then(decodedInstruction => {
					resolve(decodedInstruction)
				})
			})
		}

		return Promise.all(transaction.instructions.map(instruction => decodeInstruction(instruction)))
  }

  _setupDecoders = (): void => {
    log("setting up known decoders")
    this._registerProgramId(new SolanaDecoder())
    this._registerProgramId(new SplDecoder())
  }

  _registerProgramId = (decoder: ProgramDecoder): void => {
    this.supportedProgramId.set(decoder.programId().toBase58(), decoder)
  }

  _getDecoder = (programId: PublicKey): (ProgramDecoder | undefined) => {
    return this.supportedProgramId.get(programId.toBase58())
  }

}

