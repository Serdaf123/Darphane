import type { Metadata } from "next";
import { SerkanOralPage, serkanMetadata } from "./serkan-oral/page";

/** Ana sayfa = Serkan'ın tanıtım sitesi; kanonik ve indekslenen sürüm budur. Panel /panel'de. */
export const metadata: Metadata = serkanMetadata(true);
export default SerkanOralPage;
