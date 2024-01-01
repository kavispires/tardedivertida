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

export type ItemDictEntry = {
  groupId: string;
  itemId: string;
  color: string;
};

export type GroupDictEntry = {
  color: string;
} & GroupSummary;

export type ConnectionGame = {
  id: string;
  itemsDict: Record<string, ItemDictEntry>;
  groupsDict: Record<string, GroupDictEntry>;
  items: string[];
};
