import test from "node:test";
import assert from "node:assert/strict";
import { validateStorageKey, formatStorageValue, getCopyButtonFeedback } from "../dist-test/utils/storageHelper.js";

test("Storage Helper - validateStorageKey", async (t) => {
    await t.test("有效 Key 應通過驗證並去除前後空格", () => {
        const res = validateStorageKey("  token_123  ");
        assert.equal(res.isValid, true);
        assert.equal(res.sanitizedKey, "token_123");
    });

    await t.test("空字串或 null/undefined 應判定無效並回傳錯誤訊息", () => {
        assert.equal(validateStorageKey("").isValid, false);
        assert.equal(validateStorageKey("   ").isValid, false);
        assert.equal(validateStorageKey(null).isValid, false);
        assert.equal(validateStorageKey(undefined).isValid, false);
    });
});

test("Storage Helper - formatStorageValue", async (t) => {
    await t.test("找不到 Key 時回傳提示訊息且不顯示複製按鈕", () => {
        const res = formatStorageValue(null, "my_token");
        assert.equal(res.canCopy, false);
        assert.ok(res.display.includes("找不到 Key"));
    });

    await t.test("普通字串應正常顯示並允許複製", () => {
        const res = formatStorageValue("abc-12345", "token");
        assert.equal(res.canCopy, true);
        assert.equal(res.display, "abc-12345");
        assert.equal(res.isJson, false);
        assert.equal(res.rawValue, "abc-12345");
    });

    await t.test("JSON 字串應自動排版格式化 (Pretty Print)", () => {
        const jsonStr = '{"userId":42,"role":"admin"}';
        const res = formatStorageValue(jsonStr, "user");
        assert.equal(res.canCopy, true);
        assert.equal(res.isJson, true);
        assert.ok(res.display.includes('\n  "userId": 42'));
        assert.equal(res.rawValue, jsonStr);
    });
});

test("Storage Helper - getCopyButtonFeedback", async (t) => {
    await t.test("已複製狀態應呈現勾選符號與綠色背景", () => {
        const fb = getCopyButtonFeedback("copied");
        assert.ok(fb.text.includes("已複製"));
        assert.equal(fb.backgroundColor, "#28a745");
    });

    await t.test("錯誤狀態應呈現叉叉符號與紅色背景", () => {
        const fb = getCopyButtonFeedback("error");
        assert.ok(fb.text.includes("失敗"));
        assert.equal(fb.backgroundColor, "#dc3545");
    });

    await t.test("預設狀態應呈現剪貼簿符號與藍色背景", () => {
        const fb = getCopyButtonFeedback("default");
        assert.ok(fb.text.includes("複製內容"));
        assert.equal(fb.backgroundColor, "#008CBA");
    });
});
