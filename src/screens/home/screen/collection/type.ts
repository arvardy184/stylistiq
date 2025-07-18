export interface Collection {
  id: string;
  name: string;
  image: string | null;
  clothes: any[];
}

export type CardProps = {
  collection: Collection;
  key?: string;
};
