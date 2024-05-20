import { createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { burnV1, fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';

import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));

(async () => {

    // Use the Asset PublicKey
    const asset = publicKey("...");
    
    // [?] Use the Collection PublicKey. This is a requirement if the Asset belongs to a Collection
    const collection = publicKey("...");             

    // Burn the Asset
    const tx = await burnV1(umi, {
        asset: asset,
        // [?] collection: collection,
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const signauture = base58.deserialize(tx.signature)[0];
    console.log(signauture);

    // Fetch the Collection to verify the Asset has been burned
    const fetchedCollection = await fetchCollectionV1(umi, collection);
    console.log("Verify that the Collection Value has Changed: \n", fetchedCollection);

})();

/*

    BurnV1 Instruction:
    -----------------------------------
    Accounts:
    - asset: PublicKey | Pda;                            // The address of the asset     
    - collection?: PublicKey | Pda;                      // [?] The collection to which the asset belongs
    - authority?: Signer;                                // [?] The owner or delegate of the asset
    - payer?: Signer;                                    // [?] The account paying for the fees

    Data:
    - compressionProof?: OptionOrNullable<CompressionProofArgs>;

*/