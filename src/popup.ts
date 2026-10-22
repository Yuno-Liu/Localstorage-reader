import { validateStorageKey, formatStorageValue, getCopyButtonFeedback } from "./utils/storageHelper";

document.addEventListener("DOMContentLoaded", () => {
    const keyInput = document.getElementById("keyInput") as HTMLInputElement | null;
    const getValueBtn = document.getElementById("getValueBtn") as HTMLButtonElement | null;
    const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement | null;
    const resultDiv = document.getElementById("result") as HTMLDivElement | null;

    if (!keyInput || !getValueBtn || !copyBtn || !resultDiv) {
        console.error("Required DOM elements not found!");
        return;
    }

    let currentRawValue = ""; // 儲存當前讀取到的原始值

    // 自動載入上次輸入過的 Key
    chrome.storage.local.get(["lastTargetKey"], (data) => {
        if (data.lastTargetKey && keyInput) {
            keyInput.value = data.lastTargetKey;
        }
    });

    // 1. 點擊「取得 Value」按鈕
    getValueBtn.addEventListener("click", async () => {
        const validation = validateStorageKey(keyInput.value);

        if (!validation.isValid) {
            resultDiv.innerText = `⚠️ ${validation.error}`;
            copyBtn.style.display = "none";
            return;
        }

        const targetKey = validation.sanitizedKey;

        // 儲存輸入紀錄
        chrome.storage.local.set({ lastTargetKey: targetKey });

        // 取得目前分頁
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || tab.id === undefined) {
            resultDiv.innerText = "❌ 無法取得當前分頁";
            copyBtn.style.display = "none";
            return;
        }

        // 發送訊息向 Content Script 要求讀取
        chrome.tabs.sendMessage(
            tab.id,
            { action: "GET_LOCAL_STORAGE", key: targetKey },
            (response: { success: boolean; value?: string | null; error?: string } | undefined) => {
                if (chrome.runtime.lastError) {
                    resultDiv.innerText = "⚠️ 讀取失敗（此頁面可能不支援或請重新整理網頁）";
                    copyBtn.style.display = "none";
                    return;
                }

                if (response && response.success) {
                    const formatted = formatStorageValue(response.value, targetKey);
                    currentRawValue = formatted.rawValue;
                    resultDiv.innerText = formatted.display;

                    if (formatted.canCopy) {
                        copyBtn.style.display = "block";
                        resetCopyButtonState();
                    } else {
                        copyBtn.style.display = "none";
                    }
                } else {
                    resultDiv.innerText = response?.error ? `❌ 讀取發生錯誤: ${response.error}` : "❌ 讀取發生錯誤";
                    copyBtn.style.display = "none";
                }
            }
        );
    });

    // 2. 💡 點擊「複製內容」按鈕
    copyBtn.addEventListener("click", async () => {
        if (!currentRawValue) return;

        try {
            // 寫入剪貼簿
            await navigator.clipboard.writeText(currentRawValue);

            // 按鈕文字變更反饋
            const fb = getCopyButtonFeedback("copied");
            copyBtn.innerText = fb.text;
            copyBtn.style.backgroundColor = fb.backgroundColor;

            // 1.5 秒後恢復按鈕原本樣式
            setTimeout(() => {
                resetCopyButtonState();
            }, 1500);
        } catch {
            const fb = getCopyButtonFeedback("error");
            copyBtn.innerText = fb.text;
            copyBtn.style.backgroundColor = fb.backgroundColor;
        }
    });

    // 重置複製按鈕狀態
    function resetCopyButtonState() {
        if (copyBtn) {
            const fb = getCopyButtonFeedback("default");
            copyBtn.innerText = fb.text;
            copyBtn.style.backgroundColor = fb.backgroundColor;
        }
    }
});
