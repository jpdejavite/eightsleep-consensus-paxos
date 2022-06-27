# description

This is a solution for a eightsleep THA. I choose to implement the consensus algorithm [paxos](https://en.wikipedia.org/wiki/Paxos_(computer_science))

# decisions

I decidide to use unit tests to write the scenarios and controll all execution flow

To control execution i decided to build "command executor" so i can write on each test when each actor can perform an action

Sleep is used a lot to ensure any actor awaits for other actions to happen and enforce a specific scenario

# installation requirements

- nvm (Node version manager)

# build

- nvm use
- nvm install
- npm install
- npm run build
- mkdir output

# run

To run multiple scenarios of the consensus algorithm i have written a test and add a specific npm action for it.
To better evaluate what is happening behind the scenes all logs are redirect to output/logs.txt since jest overwrite then


## run all unit tests

npm run test-unit 

## run all scenarios

npm test 

## run happt path, all accept and consensus is obtained

npm run test-happy-path

## run one acceptor fails, but consensus is obtained

npm run test-one-acceptor-fails

## run redundant learner fails, but consensus is obtained

npm run test-redundant-learner-fails

## run proposer fails, but new consensus is obtained

npm run test-proposer-fails

## run minimum quorum fail, cannot obtain consensus

npm run test-minimum-quorum-fails

# TODO

- add docker