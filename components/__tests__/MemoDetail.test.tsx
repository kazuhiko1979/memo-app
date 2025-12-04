import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { MemoDetail } from "@/components/memos/MemoDetail";

const mockNotify = jest.fn();
const mockGetSession = jest.fn();
const mockFrom = jest.fn();
const mockPush = jest.fn();
const mockDelete = jest.fn();
const mockUpdate = jest.fn();
const mockSelect = jest.fn();
const mockFetch = jest.fn();

jest.mock("@/components/ToastProvider", () => ({
  useToast: () => ({ notify: mockNotify }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-markdown">{children}</div>
  ),
}));

jest.mock("remark-gfm", () => () => null);

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

global.fetch = (...args: unknown[]) => mockFetch(...args) as any;

describe("MemoDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
    mockPush.mockReset();
    mockFrom.mockReset();
    mockFetch.mockReset?.();
  });

  test("allows editing title and content then saves to Supabase", async () => {
    const baseMemo = {
      id: "memo-1",
      title: "元のタイトル",
      content: "元の本文",
      category: "カテゴリ",
      tags: ["#tag1"],
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-02T00:00:00.000Z",
      user_id: "user-1",
    };

    const updatedMemo = {
      ...baseMemo,
      title: "更新後のタイトル",
      content: "更新後の本文",
    };

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "user-1", email: "u@example.com" },
          access_token: "access-token",
        },
      },
      error: null,
    });

    const mockSelectAfterFetch = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: baseMemo, error: null }),
    });
    const mockUpdateSingle = jest.fn().mockResolvedValue({
      data: updatedMemo,
      error: null,
    });
    const mockSelectAfterUpdate = jest.fn().mockReturnValue({
      single: mockUpdateSingle,
    });
    const mockEqAfterUpdate = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: mockSelectAfterUpdate,
        single: mockUpdateSingle,
      }),
      select: mockSelectAfterUpdate,
    });
    const mockUpdate = jest.fn().mockReturnValue({
      eq: mockEqAfterUpdate,
      select: mockSelectAfterUpdate,
      single: mockUpdateSingle,
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: baseMemo, error: null }),
        }),
        single: jest.fn().mockResolvedValue({ data: baseMemo, error: null }),
      }),
      single: jest.fn().mockResolvedValue({ data: baseMemo, error: null }),
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === "memos") {
        return {
          select: mockSelect,
          update: mockUpdate,
          delete: mockDelete,
        };
      }
      return {};
    });

    render(<MemoDetail memoId="memo-1" />);

    await waitFor(() => {
      expect(screen.getByText("元のタイトル")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: "編集" });
    fireEvent.click(editButton);

    fireEvent.change(screen.getByLabelText("タイトル"), {
      target: { value: "更新後のタイトル" },
    });
    fireEvent.change(screen.getByLabelText("本文"), {
      target: { value: "更新後の本文" },
    });

    const saveButton = screen.getByRole("button", { name: "保存する" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "更新後のタイトル",
          content: "更新後の本文",
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText("更新後のタイトル")).toBeInTheDocument();
      expect(screen.getByText("更新後の本文")).toBeInTheDocument();
    });
  });

  test("deletes memo and redirects", async () => {
    const baseMemo = {
      id: "memo-1",
      title: "タイトル",
      content: "本文",
      category: null,
      tags: [],
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: null,
      user_id: "user-1",
    };

    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "user-1", email: "u@example.com" } } },
      error: null,
    });

    const mockSelectSingle = jest.fn().mockResolvedValue({
      data: baseMemo,
      error: null,
    });
    mockSelect.mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: mockSelectSingle,
        }),
      }),
    });

    const mockDeleteEqUser = jest.fn().mockResolvedValue({ data: null, error: null });
    const mockDeleteEq = jest.fn().mockReturnValue({
      eq: mockDeleteEqUser,
    });
    mockDelete.mockReturnValue({
      eq: mockDeleteEq,
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === "memos") {
        return {
          select: mockSelect,
          update: mockUpdate,
          delete: mockDelete,
        };
      }
      return {};
    });

    window.confirm = jest.fn().mockReturnValue(true);

    render(<MemoDetail memoId="memo-1" />);

    await waitFor(() => {
      expect(screen.getByText("タイトル")).toBeInTheDocument();
    });

    mockFetch.mockResolvedValue({ ok: true, status: 200, text: async () => "" });

    const deleteButton = screen.getByRole("button", { name: "削除" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteEqUser).toHaveBeenCalled();
    });

    expect(mockPush).toHaveBeenCalledWith("/memos");
  });
});
