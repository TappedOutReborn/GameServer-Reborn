import { Router } from "express";
import protobuf from "protobufjs";
import fs from "fs";
import config from "../../../../config.json" with { type: "json" };
import express from "express";

const router = Router();

// Add middleware to parse JSON bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Get user's currency data (both donuts and cash)
router.get("/currency/:mayhemId", async (req, res) => {
    try {
        const mayhemId = req.params.mayhemId;
        const currencyPath = `${config.dataDirectory}/${mayhemId}/${mayhemId}.currency`;
        const landPath = `${config.dataDirectory}/${mayhemId}/${mayhemId}.land`;

        // Check if currency file exists
        if (!fs.existsSync(currencyPath)) {
            return res.status(404).json({
                error: "Currency data not found for this user"
            });
        }

        // Load protobuf schema
        const root = await protobuf.load("TappedOut.proto");
        const CurrencyData = root.lookupType("Data.CurrencyData");
        const LandMessage = root.lookupType("Data.LandMessage");

        // Read and decode the currency file (donuts)
        const currencyFile = fs.readFileSync(currencyPath);
        const decodedCurrencyData = CurrencyData.decode(currencyFile);

        // Read and decode the land file (cash)
        let cash = 0;
        if (fs.existsSync(landPath)) {
            const landFile = fs.readFileSync(landPath);
            const decodedLandData = LandMessage.decode(landFile);
            if (decodedLandData.userData && decodedLandData.userData.money) {
                cash = Number(decodedLandData.userData.money);
            }
        }

        // Convert to plain object and return
        res.json({
            id: decodedCurrencyData.id,
            donuts: Number(decodedCurrencyData.vcBalance),
            donutsPurchased: Number(decodedCurrencyData.vcTotalPurchased),
            donutsAwarded: Number(decodedCurrencyData.vcTotalAwarded),
            cash: cash,
            createdAt: decodedCurrencyData.createdAt,
            updatedAt: decodedCurrencyData.updatedAt
        });
    } catch (error) {
        console.error("Error reading currency data:", error);
        res.status(500).json({
            error: "Internal server error while reading currency data"
        });
    }
});

// Update user's currency data (donuts and/or cash)
router.post("/currency/:mayhemId", async (req, res) => {
    try {
        const mayhemId = req.params.mayhemId;
        const currencyPath = `${config.dataDirectory}/${mayhemId}/${mayhemId}.currency`;
        const landPath = `${config.dataDirectory}/${mayhemId}/${mayhemId}.land`;
        const { donuts, cash } = req.body;

        if (donuts === undefined && cash === undefined) {
            return res.status(400).json({
                error: "Either donuts or cash value is required in request body"
            });
        }

        // Load protobuf schema
        const root = await protobuf.load("TappedOut.proto");
        const CurrencyData = root.lookupType("Data.CurrencyData");
        const LandMessage = root.lookupType("Data.LandMessage");

        // Update donuts if specified
        if (donuts !== undefined) {
            if (!fs.existsSync(currencyPath)) {
                return res.status(404).json({
                    error: "Currency data not found for this user"
                });
            }

            // Read existing data
            const currencyFile = fs.readFileSync(currencyPath);
            const decodedCurrencyData = CurrencyData.decode(currencyFile);

            // Create new currency data with updated donuts
            const newContent = CurrencyData.create({
                id: decodedCurrencyData.id,
                vcTotalPurchased: Number(decodedCurrencyData.vcTotalPurchased),
                vcTotalAwarded: Number(donuts), // Set both awarded and balance to new value
                vcBalance: Number(donuts),
                createdAt: decodedCurrencyData.createdAt,
                updatedAt: Date.now()
            });

            // Encode and write back to file
            fs.writeFileSync(currencyPath, CurrencyData.encode(newContent).finish());
        }

        // Update cash if specified
        if (cash !== undefined) {
            if (!fs.existsSync(landPath)) {
                return res.status(404).json({
                    error: "Land data not found for this user"
                });
            }

            // Read existing land data
            const landFile = fs.readFileSync(landPath);
            const decodedLandData = LandMessage.decode(landFile);

            // Update cash value in userData
            if (!decodedLandData.userData) {
                decodedLandData.userData = {};
            }
            decodedLandData.userData.money = Number(cash);

            // Encode and write back to file
            fs.writeFileSync(landPath, LandMessage.encode(decodedLandData).finish());
        }

        res.json({
            message: "Currency updated successfully",
            updated: {
                donuts: donuts !== undefined ? donuts : undefined,
                cash: cash !== undefined ? cash : undefined
            }
        });
    } catch (error) {
        console.error("Error updating currency data:", error);
        res.status(500).json({
            error: "Internal server error while updating currency data"
        });
    }
});

export default router;