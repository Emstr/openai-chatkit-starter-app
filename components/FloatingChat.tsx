"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "./ChatKitPanel";
import { useChat } from "@/contexts/ChatContext";

export function FloatingChat() {
  const { isOpen, openChat, closeChat } = useChat();
  // Always use light theme
  const scheme = "light";

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[FloatingChat] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[FloatingChat] response end");
    }
  }, []);

  return (
    <>
      {/* Bottom Chat Input Bar - Styled to match ChatKit composer */}
      {!isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[80] mx-auto w-full max-w-[760px] px-4 pb-6">
          <button
            onClick={openChat}
            className="w-full cursor-pointer"
            aria-label="Open chat"
          >
            {/* Match ChatKit composer styling - rounded-full per theme config */}
            <div className="flex w-full items-center gap-4 rounded-full border-2 border-gray-200 bg-white px-6 py-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md hover:bg-gray-50 active:scale-[0.98]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6 flex-shrink-0 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <span className="flex-1 text-left text-base text-gray-500">
                Ask Marloo anything...
              </span>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-4 w-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Modal Overlay - Backdrop - Higher z-index to cover nav */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={closeChat}
          aria-hidden="true"
        />
      )}

      {/* Always render ChatKitPanel (hidden when closed) so it can initialize */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-5xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${isOpen ? "" : "pointer-events-none"}`}
      >
        <div className="relative flex h-[90vh] max-h-[90vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Ask Marloo
            </h2>
            <button
              onClick={closeChat}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Panel */}
          <div className="flex-1 overflow-hidden">
            <ChatKitPanel
              theme={scheme}
              onWidgetAction={handleWidgetAction}
              onResponseEnd={handleResponseEnd}
            />
          </div>
        </div>
      </div>
    </>
  );
}

