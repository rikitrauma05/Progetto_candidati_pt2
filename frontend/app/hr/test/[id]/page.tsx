import DettaglioTest from "./DettaglioTest";

export default async function Page({ params }: { params: any }) {
    // in Next 15 params è async → lo risolviamo
    const resolvedParams = await params; // { id: string }
    const idTest = Number(resolvedParams.id);

    return <DettaglioTest idTest={idTest} />;
}
