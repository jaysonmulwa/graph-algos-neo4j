(async() => {

    const neo4j = require('neo4j-driver');
    const uri = 'neo4j+s://.databases.neo4j.io';
    const user = 'neo4j';
    const password = '?OVFpa9xjt9dOIHbHMFDj2B54bzrsl4QxCVh849IFMsw';
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    try {

        const towns = [
            {
                "townId": "1",
                "Name": "Kisumu",
                "Longitude": "34.768",
                "Latitude": "-0.0917"
            },
            {
                "townId": "2",
                "Name": "Nairobi",
                "Longitude": "36.8219",
                "Latitude": "-1.2921"
            },
            {
                "townId": "3",
                "Name": "Machakos",
                "Longitude": "37.2634",
                "Latitude": "-1.5177"
            },
            {
                "townId": "4",
                "Name": "Thika",
                "Longitude": "37.0834",
                "Latitude": "-1.0388"
            },
            {
                "townId": "5",
                "Name": "Mombasa",
                "Longitude": "39.6682",
                "Latitude": "-4.0435"
            }
        ];
        
        await createTowns(driver, towns[0]);
        await createTowns(driver, towns[1]);
        await createTowns(driver, towns[2]);
        await createTowns(driver, towns[3]);
        await createTowns(driver, towns[4]);

        //await deleteAll(driver);
        //await findTowns(driver, towns);

    } catch (error) {
        console.error(`Something went wrong: ${error}`);
    } finally {
        await driver.close();
    }

    async function createTowns (driver, town) {

        const session = driver.session({ database: 'neo4j' });

        try {

                const writeQuery = `MERGE (t1:Location { name: $name, id: $id, longitude: $longitude, latitude: $latitude })
                                    RETURN t1`;

                const name = town.Name;
                const id  = town.townId;
                const longitude = town.Longitude;
                const latitude = town.Latitude;

                const writeResult = await session.executeWrite(tx =>
                    tx.run(writeQuery, { name, id, longitude, latitude })
                );

                writeResult.records.forEach(record => {
                    const person1Node = record.get('t1');
                    console.info(`Created : ${person1Node.properties.name}`);
                });

            
        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        } finally {
            await session.close();
        }
    }

    async function deleteAll (driver) {
        const session = driver.session({ database: 'neo4j' });
        const query = `MATCH (n) DETACH DELETE n`;
        await session.executeWrite(tx =>
            tx.run(query)
        );
        await session.close();     
    }

    async function findTowns(driver, towns) {

        const session = driver.session({ database: 'neo4j' });
        try {
            const readQuery = `MATCH (t:Location)
                            WHERE t.name = $name
                            RETURN t.name AS name`;
            
            const name = towns[0].Location;
            const readResult = await session.executeRead(tx =>
                tx.run(readQuery, { name })
            );
            readResult.records.forEach(record => {
                console.log(`Found person: ${record.get('name')}`)
            });

        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        } finally {
            await session.close();
        }
    }

})();

