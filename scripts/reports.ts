// The lead report from chat: the reports skill's command with this lander's database, zone and currency. `--help` for usage.
import { offer } from "../src/offer";
import { reportsCli } from "../src/reports/cli";
import { site } from "../src/site";
import { withDb } from "./migrate";

await reportsCli(process.argv.slice(2), { withDb, zone: site.timeZone, currency: offer.currency });
