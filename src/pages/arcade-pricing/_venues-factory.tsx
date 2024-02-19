export interface PriceTier {
    readonly realCost: number;
    readonly creditValue: number;
}

export interface VenueData {
    readonly region: string;
    readonly venue: string;
    readonly lastUpdated: string;

    // readonly currency: "AUD" | "NZD"; // Probs don't need this yet.
    readonly priceTiers: PriceTier[];

    readonly comment: string;
}


// ---------------------------------------------------------------------------------------


function printCurrency(v: number) {
    const left = Math.floor(v / 100);
    let right = (v % 100).toString();
    switch (right.length) {
        default:
            throw new Error("Unexpected cents length.");
        case 1:
            right = "0" + right;
        case 2:
    }
    return `$${left}.${right}`;
}


interface VenuesTableRowProps {
    readonly data: VenueData;
}

function VenuesTableRow({data}: VenuesTableRowProps) {
    // TODO: We currently assume one price tier.
    if (data.priceTiers.length != 1) throw new Error("Only supports one price tier right now.");
    const priceTier = data.priceTiers[0];
    if (!priceTier) throw new Error("Unexpected falsy.");

    // TODO: Needs lastUpdated validation

    return <tr>
        <td>{data.lastUpdated}</td>
        <td>{data.venue}</td>
        <td>{printCurrency(priceTier.realCost)}</td>
        <td>{printCurrency(priceTier.creditValue)}</td>
        <td>{data.comment}</td>
    </tr>;
}


// ---------------------------------------------------------------------------------------


interface VenuesTableProps {
    readonly regions: string[];
}

// VenuesFactory is NOT a JSX component!
// VenuesFactory creates JSX components.
export class VenuesFactory {
    venues: VenueData[];

    constructor(venues: VenueData[]) {
        this.venues = venues;
    }

    getVenuesTableComponent() {
        const venues = this.venues;
        function VenuesTable({regions}: VenuesTableProps) {
            return <p><table>
                <thead>
                    <tr>
                        <th>Last Updated</th>
                        <th>Venue</th>
                        <th>Real Cost</th>
                        <th>Provided Credit Value</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {venues
                        .filter(x => regions.includes(x.region))
                        .map(x => <VenuesTableRow data={x} />)
                    }
                </tbody>
            </table></p>;
        }
        return VenuesTable;
    }
}

