export const voucherKeys = {
  all: ['vouchers'] as const,
  lists: () => [...voucherKeys.all, 'list'] as const,
  list: (keyword: string, page: number) => [...voucherKeys.lists(), { keyword, page }] as const,
};

export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (keyword: string, page: number) => [...campaignKeys.lists(), { keyword, page }] as const,
};

export const comboKeys = {
  all: ['combos'] as const,
  lists: () => [...comboKeys.all, 'list'] as const,
  list: (keyword: string, page: number) => [...comboKeys.lists(), { keyword, page }] as const,
};
