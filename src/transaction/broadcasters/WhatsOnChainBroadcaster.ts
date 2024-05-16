import {BroadcastResponse, BroadcastFailure, Broadcaster} from '../Broadcaster.js'
import Transaction from '../Transaction.js'
import {HttpClient} from "../http/HttpClient.js";
import defaultHttpClient from "../http/DefaultHttpClient.js";

/**
 * Represents an WhatsOnChain transaction broadcaster.
 */
export default class WhatsOnChainBroadcaster implements Broadcaster {
    network: string
    URL: string
    private httpClient: HttpClient;

    /**
     * Constructs an instance of the WhatsOnChain broadcaster.
     *
     * @param {string} network - The URL endpoint for the WhatsOnChain API.
     * @param {HttpClient} httpClient - The HTTP client used to make requests to the ARC API.
     */
    constructor(network: string = 'main', httpClient: HttpClient = defaultHttpClient()) {
        this.network = network
        this.URL = `https://api.whatsonchain.com/v1/bsv/${network}/tx/raw`
        this.httpClient = httpClient
    }

    /**
     * Broadcasts a transaction via WhatsOnChain.
     *
     * @param {Transaction} tx - The transaction to be broadcasted.
     * @returns {Promise<BroadcastResponse | BroadcastFailure>} A promise that resolves to either a success or failure response.
     */
    async broadcast(tx: Transaction): Promise<BroadcastResponse | BroadcastFailure> {
        let rawTx = tx.toHex()

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain'
            },
            body: JSON.stringify({rawTx})
        }

        try {
            const response = await this.httpClient.fetch(this.URL, requestOptions)
            const data = await response.json()

            if (data.txid as boolean || response.ok as boolean || response.statusCode === 200) {
                return {
                    status: 'success',
                    txid: data.txid,
                    message: 'broadcast successful'
                }
            } else {
                return {
                    status: 'error',
                    code: data.status ?? 'ERR_UNKNOWN',
                    description: data ?? 'Unknown error'
                }
            }
        } catch (error) {
            return {
                status: 'error',
                code: '500',
                description: typeof error.message === 'string'
                    ? error.message
                    : 'Internal Server Error'
            }
        }
    }
}