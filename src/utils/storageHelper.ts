/**
 * 📌 Storage 解析與驗證輔助工具
 */

export interface FormattedValueResult {
    display: string;
    canCopy: boolean;
    isJson: boolean;
    rawValue: string;
}

/**
 * 驗證輸入的 Storage Key 是否合法
 */
export function validateStorageKey(key: string | null | undefined): { isValid: boolean; sanitizedKey: string; error?: string } {
    if (!key) {
        return { isValid: false, sanitizedKey: "", error: "請輸入有效的 Key！" };
    }
    const trimmed = key.trim();
    if (trimmed.length === 0) {
        return { isValid: false, sanitizedKey: "", error: "Key 不可僅包含空格！" };
    }
    return { isValid: true, sanitizedKey: trimmed };
}

/**
 * 格式化 Storage 數值顯示
 */
export function formatStorageValue(value: string | null | undefined, targetKey: string): FormattedValueResult {
    if (value === null || value === undefined) {
        return {
            display: `❓ 找不到 Key 為 "${targetKey}" 的資料`,
            canCopy: false,
            isJson: false,
            rawValue: "",
        };
    }

    let isJson = false;
    let display = value;

    // 嘗試以格式化 JSON 排版呈現
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "object" && parsed !== null) {
            display = JSON.stringify(parsed, null, 2);
            isJson = true;
        }
    } catch {
        // 非 JSON，直接使用原始字串
    }

    return {
        display,
        canCopy: true,
        isJson,
        rawValue: value,
    };
}

/**
 * 取得複製按鈕的回饋樣式
 */
export function getCopyButtonFeedback(status: "copied" | "error" | "default"): { text: string; backgroundColor: string } {
    switch (status) {
        case "copied":
            return { text: "✅ 已複製到剪貼簿！", backgroundColor: "#28a745" };
        case "error":
            return { text: "❌ 複製失敗", backgroundColor: "#dc3545" };
        default:
            return { text: "📋 複製內容", backgroundColor: "#008CBA" };
    }
}
