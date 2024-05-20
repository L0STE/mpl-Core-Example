import { createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { updateV1, fetchAssetV1, updateAuthority } from '@metaplex-foundation/mpl-core'
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

    // Update the Asset
    const tx = await updateV1(umi, {
        asset: asset,
        // [?] collection: collection,
        newName: 'My New NFT',
        newUri: null,
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const signauture = base58.deserialize(tx.signature)[0];
    console.log(signauture);

    // Fetch the Asset to verify the changes
    const fetchedAsset = await fetchAssetV1(umi, asset);
    console.log("Verify that the Information has Changed: \n", fetchedAsset);
})();

/*

    UpdateV1 Instruction:
    -----------------------------------
    Accounts:
    - asset: PublicKey;
    - collection?: PublicKey | Pda;
    - aut Signer;
    - payer?: hority?:Signer;

    Data:
    - newName: OptionOrNullable<string>;
    - newUri: OptionOrNullable<string>;
    - newUpdateAuthority?: OptionOrNullable<UpdateAuthorityArgs>;

*/

/*

    Additional Example:
    -----------------------------------
    - Make an Asset Immutable:

        await updateV1(umi, {
            asset: asset,
            newUpdateAuthority: updateAuthority('None'),
            newName: null,
            newUri: null,
        }).sendAndConfirm(umi)

    - Add the Asset to a Collection:

        await updateV1(umi, {
            asset: asset,
            newUpdateAuthority: updateAuthority('Collection', [collection])
            newName: null,
            newUri: null,
        }).sendAndConfirm(umi)
    
*/