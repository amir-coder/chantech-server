# chantech API
backend of chantech App
IN this repository you find the code of the REST API of Chantech, Chantech is a mobile App for Management of Tasks, Workers and materials in a construction site. Follow this link https://github.com/chechna9/Chantech-flutterApp to find the front-end project made by @chechna9. 

## Description:

A Construction company will like to keep a history of the equipment installed in each site. A piece of equipment is
identified by a number, a label and a selling price. For the same site, several identical equipment
can be installed. For each site, a worker is appointed as site manager. During a
day, a worker can intervene on different sites, the company will like to be able to analyze the hours by
construction site, per day and per worker.

## Solution:

### - Use case model: (In French)

![Alt Image text](/documents/Use%20Case.png?raw=true "Use Case")

### - Data Base model: (In French)

![Alt Image text](/documents/Data%20Base%20model.png?raw=true "Use Case")

### - Main REST API Routes:
- Chantier (Construction Site)
- Equipement
- Ouvrier (Worker)
- tache (Tasks)

### - Tech Used:
- wamp server for creating and managing the Relational Database
- express for making the REST API
- mysql2 to connect with the database
