import { generateSigner, percentAmount, createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createPlugin, createV1, pluginAuthority, ruleSet, fetchAssetV1 } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';

import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));

(async () => {

    // Generate the Asset PublicKey
    const asset = generateSigner(umi);
    console.log(asset.publicKey.toString());

    // [?] Use the Collection PublicKey if you want to add the Asset to a Collection
    const collection = publicKey("...")

    // Generate the Asset
    const tx = await createV1(umi, {
        name: 'My NFT',
        uri: 'https://example.com/my-nft.json',
        asset: asset,
        // collection: collection,
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const signauture = base58.deserialize(tx.signature)[0];
    console.log(signauture);

    // Fetch the Asset to verify that has been created
    const fetchedAsset = await fetchAssetV1(umi, asset.publicKey);
    console.log("Verify that the Asset has been Minted: \n", fetchedAsset);
})();

/*

    CreateV1 Instruction:
    -----------------------------------
    Accounts:
    - asset: Signer;                                    // The Asset KeyPair to initialize the Asset
    - collection?: PublicKey | Pda;                     // [?] The Collection to which the Asset belongs.
    - authority?: Signer;                               // [?] The Authority signing for creation. Defaults to the Umi Authority if not present.
    - payer?: Signer;                                   // [?] The Account paying for the storage fees. Defaults to the Umi Payer if not present.
    - owner?: PublicKey | Pda;                          // [?] The Owner of the new Asset. Defaults to the Authority if not present. Can be used to mint something directly to a user.
    - updateAuthority?: PublicKey | Pda;                // [?] The Authority on the new Asset. Defaults to the Authority if not present.

    Data:
    - name: string;
    - uri: string;
    - plugins?: OptionOrNullable<Array<PluginAuthorityPairArgs>>;

*/

/*

    Additional Example:
    -----------------------------------
    - Create Asset With the Royalty Plugin:

        await createV1(umi, {
            asset: assetSigner,
            name: 'My NFT',
            uri: 'https://example.com/my-nft.json',
            plugins: [
                {
                plugin: createPlugin(
                    {
                        type: 'Royalties',
                        data: {
                            basisPoints: 500,
                            creators: [
                                {
                                    address: generateSigner(umi).publicKey,
                                    percentage: 20,
                                },
                                {
                                    address: generateSigner(umi).publicKey,
                                    percentage: 80,
                                },
                            ],
                            ruleSet: ruleSet('None'), // Compatibility rule set
                        },
                    }
                ),å
                authority: pluginAuthority("None"),
                },
            ],
        }).sendAndConfirm(umi)

*/

