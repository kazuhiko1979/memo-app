import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { MemoCreateForm } from "@/components/MemoCreateForm";
import { ToastProvider } from "@/components/ToastProvider";

jest.mock("react-markdown", () => {
  return {
    __esModule: true,
    default: ({
      children,
      ...rest
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => {
      return <div>{children}</div>;
    },
  };
});

jest.mock("remark-gfm", () => () => null);

const insertMock = jest.fn().mockResolvedValue({ error: null });
const getUserMock = jest.fn().mockResolvedValue({
  data: { user: { id: "user-1", email: "user@example.com" } },
  error: null,
});
const onAuthStateChangeMock = jest.fn().mockReturnValue({
  data: { subscription: { unsubscribe: jest.fn() } },
});

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: (...args: unknown[]) => getUserMock(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
    },
    from: () => ({
      insert: (...args: unknown[]) => insertMock(...args),
    }),
  },
}));

const renderForm = async () => {
  const utils = render(
    <ToastProvider>
      <MemoCreateForm />
    </ToastProvider>,
  );
  await waitFor(() => expect(getUserMock).toHaveBeenCalled());
  return utils;
};

describe("MemoCreateForm", () => {
  beforeEach(() => {
    insertMock.mockClear();
    getUserMock.mockClear();
  });

  it("プレビューが入力に合わせて更新される", async () => {
    const user = userEvent.setup();
    await renderForm();

    const contentArea = await screen.findByLabelText("本文（Markdown）");
    await user.clear(contentArea);
    await user.type(contentArea, "# 見出しメモ");

    const preview = screen.getByTestId("markdown-preview");
    await waitFor(() => {
      expect(within(preview).getByText(/見出しメモ/)).toBeInTheDocument();
    });
  });

  it("ログイン済みで保存するとSupabaseにinsertされる", async () => {
    const user = userEvent.setup();
    await renderForm();

    const titleInput = screen.getByLabelText("タイトル");
    const tagsInput = screen.getByLabelText("タグ（カンマ区切り）");
    const contentArea = await screen.findByLabelText("本文（Markdown）");

    await user.clear(titleInput);
    await user.type(titleInput, "UI設計メモ");
    await user.clear(tagsInput);
    await user.type(tagsInput, "ui, research");
    await user.clear(contentArea);
    await user.type(contentArea, "メモ本文です");

    await user.click(screen.getByRole("button", { name: "この内容で保存" }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(insertMock).toHaveBeenCalledWith({
      title: "UI設計メモ",
      content: "メモ本文です",
      category: null,
      tags: ["#ui", "#research"],
      user_id: "user-1",
    });
  });
});
