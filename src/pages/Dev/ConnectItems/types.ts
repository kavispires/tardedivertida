export type ConnectionGroup = {
  id: string;
  name: string;
  items: number[];
  difficulty: number;
};

export type GroupSummary = {
  groupId: string;
  name: string;
  count: number;
  items: string[];
};

export type ItemGroup = {
  itemId: string;
  groups: GroupSummary[];
  total: number;
};

export type ConnectionGame = {
  id: string;
  itemsDict: Record<
    string,
    {
      groupId: string;
      itemId: string;
      color: string;
    }
  >;
  groupsDict: Record<
    string,
    {
      name: string;
      color: string;
    }
  >;
  items: string[];
};
