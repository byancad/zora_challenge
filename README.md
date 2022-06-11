# Stub3

A ticketing platform powered by Web3 that benefits the artists and the fans. 

## Problem

### Artist and fans are being exploited 

- Counterfeit tickets
  - fans have no way of knowing they are buying insecure tickets 
- Scalpers 
  - the artists do not get any profit of the ticket resale price 


## App Highlights

- Proof of authenticity 
- Proof of ownership
- Collectible NFTs
- Creator resell share

## Tech Used 

### UI 
- React.js
- Typescript
- Next.js
### Smart Contracts
- Hardhat 
  - [https://github.com/byancad/ethportland_hardhat](https://github.com/byancad/ethportland_hardhat)
### Testnets
- SKALE
- Harmony 
- Rinkeby
### User onramp 
- Transak 

## Under the Hood

- Creating an event 
  - Deploys an ERC721 Token Contract   
- Buying a ticket
  - Mints a collectible ticket token   
- Listing a ticket to resale
  - Transfers ownership to market and allows user to purchase at asking price  
- Purchasing a resale ticket 
  - Splits a percantage of the money spent on resale with the artist. Exact percentage split is set by artist and the time of contract deployment.  

## Getting Started

First, package installs:

`yarn`

Second, run the devlopment server:

`yarn dev`

Open [http://localhost:3000](http://localhost:3000) with your browser and connect to Rinkeby, Harmony, or Skale testnets to start using the application.  

## Demo Video 

https://www.youtube.com/watch?v=qPCiyij9_KQ&t=405s

<img width="1277" alt="image" src="https://user-images.githubusercontent.com/55162362/162838339-872e1568-85af-45c5-98b4-53b6a9bea7c4.png">

<img width="1277" alt="image" src="https://user-images.githubusercontent.com/55162362/162838561-dfcb3bdf-2d16-4680-8797-b852a8df186d.png">

<img width="1273" alt="image" src="https://user-images.githubusercontent.com/55162362/162838818-686da826-d1d2-4fab-8779-8d85a49accf5.png">


## Learn More

If you have any questions please feel free to reach out, your feedback and contributions are welcome!

Twitter: @byancadlf



