## Tech Stack
- ### Frontend:
  - `HTTP API` only through [Swagger](https://pepperstone-288751689763.asia-southeast1.run.app/api).
- ### Backend: 
  - `Typescript on NestJS`.
  - `In-memory` storage (volatile memory):
    - It doesn't require much configuration/setup like MongoDB, PostgreSQL, i.e fitting the 2-3h timing for this take-home test.
    - It helps to illustrate coding structure, i.e it is setup in a decoupled way following `Domain-driven-design` so that it can be switched by other types of storages without much changing to the logic if needed.
    
- ### Infrastructure.
  #### Tech stack:
    - `Serverless` on GCP - i.e `Cloudrun` is the computing layer.
    - CICD using `Cloudbuild` integration with `Github` CICD.
    - Reasons for this infra tech stack:
      - It is well suited for fast deployment and e2e integration, i.e fitting the 2-3h timing for this take-home test.
      - The horizontal scaling is abstracted away and handled by cloud providers.
      - GPC over Azure/AWS because I have free personal credits and account available.
  #### Deployment:
    - GCP's Cloudbuild integrate with Github's CICD.
    - I only needed to create a Dockerfile and setup serverless with a MVP networking layer like VPN and Cloud NAT.
    - Serverless will handle auto scaling and periodically health check.
    - Most of the flow is handled by out-of-box solution by Github CICD and Google Cloud Build.
    - No KMS and other components like persistent layer or IoC as they would force me going over 3h limit.

- ### AI Assistant Tools:
  - Github Copilot for code completion.
    - Except helping with unit tests and docs for method-contracts, the majority of the code (>90%) is self-written.


## Architecture
### Design Philosophies:
- In general, code structure following `modular monolith` & `domain-driven-design`.
- Implementation following `contract-first-driven` development, by declaring the contracts first and implementation later: [Github Commit](https://github.com/luke-nguyen990/pepperstone/commit/c2c84c5f44d843a908f91d40da87eff3653b4fd4)

### Modularized Components:

#### Player Module's contracts
```typescript
createPlayer(name: string): PlayerModel

getPlayer(id: string): PlayerModel

getPlayers(ids: string[]): PlayerModel[]
```

#### Game Module's contracts
```typescript
createGame(): GameModel

getGame(gameId: string): GameModel

startGame(gameId: string): GameModel

addPlayer(gameId: string, playerName: string): GameModel

addRollScores(gameId: string, playerId: string, scores: string[]): GameModel
```

#### Score Module's contracts
```typescript
computeFrameScores(rolls: string[][]): number[]
```

## Process break-down:
*Although Github commits history shows only around 2 hours of coding, the total time is estimated to be 3 hours, plus/minus 15 minutes.*


Components which are not shown in Github commit history:

- 5-10 minutes: Reading requirements and deciding on the design, code structure, tech stack.
  - The test's description gives a lot of freedom as well as open questions for candidates. The boundary for choosing code structure, tech-stack is big.
  - There is a balance between not over engineering and going over 3h while still showing the engineering best practices.
- 10-15 minutes: Thinking about how the modularized components and their contracts look.
- 10-15 minutes: Working on the state machines for:
  - Game states changing. 
  - Score updating and validating.
  - I identified those 2 parts have many edge-cases, thus state-machine would help to cover all scenarioes. Some unhappy cases examples:
    - Start game without enough players.
    - Start game with less than 2 players.
    - Sending invalid rolls scores, out-of-orders.
    - Game is not finished after 10th frame scores from all players.
- 15-20 minutes: Setting up Infra and CICD.
- 20-25 minutes: README.md

Swagger API is availabe at [Google Serverless Cloudrun](https://pepperstone-288751689763.asia-southeast1.run.app/api)