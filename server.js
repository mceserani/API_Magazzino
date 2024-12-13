import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();

app.use(express.json());

app.get("/api/prodotti", (req, res) => {

    const db = new sqlite3.Database("magazzino.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare("SELECT * FROM prodotto;");

    // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    // Eseguiamo la query con stmt.all
    stmt.all((err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

});

app.post("/api/prodotto", (req, res) => {
    
    const db = new sqlite3.Database("magazzino.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    let stmt = db.prepare("INSERT INTO prodotto (nome, prezzo, quantità) VALUES (?,?,?);");

     // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    const prodotto = req.body;

    stmt.run(prodotto.nome, prodotto.prezzo, prodotto.quantità, (err) => {
        if (err) {
            console.error("Errore Run:", err.message);
            res.status(500).send(err.message);
        } else {
            res.send("Prodotto inserito correttamente");
        }

        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    })

});

app.listen(3000, () => {
    console.log("Server in ascolto sulla porta 3000");
});
