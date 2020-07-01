# MOVE by Paras
Share & show your support for the MOVEMENT that you believe in!

Here's how MOVE protect your privacy:

✔ Pseudonymous

✔ Everything happens on client-side

✔ Machine Learning to Pixelated Face

✔ Auto-strip Image Metadata

✔ Decentralized (IPFS + NEARprotocol)

[Try MOVE](https://move.paras.id)

## Demo
[![MOVE by Paras](http://img.youtube.com/vi/S-TDa9-T8L8/0.jpg)](http://www.youtube.com/watch?v=S-TDa9-T8L8 "MOVE by Paras")

# Under the Hood

## Powered by IPFS & NEARprotocol
MOVE is using [Paras Smart Contract](https://github.com/hdriqi/paras-alpha/tree/master/assembly) as it main engine. Paras is a decentralized digital collective memory that allows everyone to store and create memory that they truly own. 

MOVE is also using [Paras Backend Indexer](https://github.com/hdriqi/paras-backend-indexer) to get the data stored on the smart contract to allow faster and better search/query capabilities.

To store image file, MOVE is using [IPFS](https://github.com/ipfs) that allows the image to be stored in decentralized manner. Paras IPFS node is used as the main destination to store and retrieve the data from IPFS.

## Face Detection & Pixelated
MOVE is using [face-api-js](https://github.com/justadudewhohacks/face-api.js) that implemented on top of tensorflow.js that enable client-side machine learning capability. It is used to do face detection that will be pixelated to protect the privacy for the protestor and supporters. The uploaded image is also re-draw on canvas to remove all the metadata such as date time, GPS and other personal information that can be gathered from the photo.
