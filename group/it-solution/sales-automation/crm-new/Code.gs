// ============================================================
// 営業CRM - Google Apps Script (Code.gs)
// 営業CRM.gsheet > 拡張機能 > Apps Script に貼り付けて使用
//
// 初回設定:
//   GASエディタ > プロジェクトの設定 > スクリプトプロパティ
//   CLAUDE_API_KEY = sk-ant-... を追加すること
// ============================================================

var SPREADSHEET_ID = '1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw';
var SHEET_NAME = 'シート1';
var SENDER_NAME = '龍竹一生 / 株式会社ライフタイムサポート';
var SENDER_EMAIL = 'ryouchiku@life-time-support.com';

// ============================================================
// Web App エントリポイント
// ============================================================
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('営業メール確認システム');
}

// ============================================================
// 顧客データ取得（フェーズ・エピソード含む）
// ============================================================
function getCustomersWithPhase() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, 32).getValues();
  var customers = [];

  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    if (!r[0]) continue; // 会社名なしはスキップ

    customers.push({
      row:           i + 2,
      company:       String(r[0]  || ''),   // A: 会社名
      department:    String(r[1]  || ''),   // B: 部署
      title:         String(r[2]  || ''),   // C: 役職
      name:          String(r[3]  || ''),   // D: 氏名
      email:         String(r[4]  || ''),   // E: メールアドレス
      url:           String(r[7]  || ''),   // H: ホームページURL
      episode:       String(r[13] || ''),   // N: 出会いのエピソードメモ ★
      service:       String(r[14] || ''),   // O: 推奨サービス
      reason:        String(r[15] || ''),   // P: 推奨理由
      subject:       String(r[16] || ''),   // Q: メール件名
      body:          String(r[17] || ''),   // R: メール本文
      status:        String(r[18] || '未送信'), // S: 送信ステータス
      followText:    String(r[20] || ''),   // U: フォロー文
      followStatus:  String(r[21] || ''),   // V: フォローステータス
      phase:         String(r[23] || ''),   // X: 営業フェーズ
      aiSeminarPhase: String(r[27] || ''),  // AB: AIセミナーフェーズ
    });
  }

  return customers;
}

// ============================================================
// エピソードメモ保存（N列）
// ============================================================
function saveMemo(row, memo) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  sheet.getRange(row, 14).setValue(memo); // N列
  return { success: true, message: 'エピソードメモを保存しました' };
}

// ============================================================
// AIメール文章生成
// ============================================================
function generateEmailDraft(row, memo) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  var r = sheet.getRange(row, 1, 1, 32).getValues()[0];

  var company = String(r[0]  || '');
  var dept    = String(r[1]  || '');
  var title   = String(r[2]  || '');
  var name    = String(r[3]  || '');
  var url     = String(r[7]  || '');

  // エピソードメモを N列に保存
  if (memo) {
    sheet.getRange(row, 14).setValue(memo);
  }

  // プロンプト生成
  var prompt = buildEmailPrompt(company, dept, title, name, url, memo || '');

  // Claude API 呼び出し
  var aiResponse = callClaudeAPI(prompt);
  if (!aiResponse) {
    return { success: false, message: 'AI生成に失敗しました。APIキー(CLAUDE_API_KEY)を確認してください。' };
  }

  // JSONパース
  var parsed = parseEmailResponse(aiResponse);
  if (!parsed) {
    return { success: false, message: 'レスポンスのパースに失敗しました。再度お試しください。' };
  }

  // スプレッドシートに書き込み
  sheet.getRange(row, 17).setValue(parsed.subject); // Q: 件名
  sheet.getRange(row, 18).setValue(parsed.body);     // R: 本文
  sheet.getRange(row, 19).setValue('下書き済');       // S: ステータス
  sheet.getRange(row, 26).setValue(new Date());       // Z: 最終更新日

  return {
    success: true,
    subject: parsed.subject,
    body:    parsed.body,
    company: company,
    name:    name,
    message: 'メール文章を生成しました'
  };
}

// ============================================================
// プロンプト構築
// ============================================================
function buildEmailPrompt(company, dept, title, name, url, memo) {

  var episodeBlock = (memo && memo.trim())
    ? '【出会いのエピソード】\n' + memo.trim() + '\n\n'
      + '※ このエピソードを活かし、書き出しは「先日は○○でお話しできて...」のように具体的な場面に触れた一文から始めること。相手が「覚えてくれている」と感じる温かみを大切に。\n\n'
    : '【出会いのエピソード】\n（記録なし）\n\n'
      + '※ エピソードがない場合は「先日は名刺交換させていただきありがとうございました。」のような一般的な書き出しにすること。\n\n';

  return (
    'あなたは株式会社ライフタイムサポートの代表・龍竹一生として、名刺交換後のお礼・ご提案メールを作成してください。\n\n'

    + '【顧客情報】\n'
    + '会社名: ' + company + '\n'
    + '部署: '   + (dept  || '不明') + '\n'
    + '役職: '   + (title || '不明') + '\n'
    + '氏名: '   + name + ' 様\n'
    + 'HP: '     + (url   || 'なし') + '\n\n'

    + episodeBlock

    + '【龍竹一生プロフィール（自己紹介に使うこと）】\n'
    + '株式会社ライフタイムサポート代表。リフォーム会社を20年経営する現役社長。'
    + '42Tokyo（世界的エンジニア養成校）卒業。2025年埼玉DX大賞受賞。'
    + '非IT出身ゆえに「現場目線」のDX支援が強み。TEL: 070-1298-0180\n\n'

    + '【メール構成（この順番で書くこと）】\n'
    + '1. エピソードに触れた温かみのある書き出し（相手の言葉・場面を引用して共感・感謝）\n'
    + '2. 自己紹介（簡潔に。龍竹一生 / 株式会社ライフタイムサポート）\n'
    + '3. メインサービスの提案（下記判定基準に基づく）\n'
    + '4. 他の4サービスも1〜2行で簡潔に触れる\n'
    + '5. 実績・数字を1つ添える（例: 年間528時間削減、約1,000万円コスト削減など）\n'
    + '6. 締め: 「まずは15分のオンライン相談はいかがでしょうか？お気軽にご返信ください。」\n\n'

    + '【サービス判定基準】\n'
    + '以下のいずれかに該当する場合は「個人事業主」→ ⑤AIパーソナルトレーニングをメインに提案:\n'
    + '  - 会社名に株式会社・有限会社・合同会社等の法人格がない\n'
    + '  - 士業の個人事務所（例: ○○社労士事務所、○○税理士事務所）\n'
    + '  - 役職にフリーランス・個人事業主を含む\n'
    + 'それ以外（法人）→ ①生成AI活用セミナーをメインに提案\n\n'

    + '【全5サービス一覧（本文で紹介すること）】\n'
    + '① 生成AI活用セミナー: プログラミング不要。3ヶ月でPC初心者も業務を劇的に効率化。人材開発支援助成金で最大75%補助→実質3.75万円〜\n'
    + '② IT内製化サポート: 月額15〜30万円の専属エンジニア契約。補助金で費用1/2〜2/3補填可。月次MTGで改善を繰り返す\n'
    + '③ デバイス販売: NEC・Lenovo等の主要メーカーをAmazonより低価格で提供。1台〜大量導入まで対応\n'
    + '④ WEBマーケティングサポート: Google広告代行（広告費の20%）、LLMO対策（完全成果報酬・1日1,000円）\n'
    + '⑤ AIパーソナルトレーニング: 1対1完全オーダーメイド。1名12万円、3名なら7万円/人\n\n'

    + '【文体ルール】\n'
    + '- 敬語（です・ます調）で統一\n'
    + '- 1文は60文字以内を目安に\n'
    + '- 絵文字は一切使わない\n'
    + '- 押し売り感を出さない。「一緒に解決しましょう」というパートナー感を大切に\n'
    + '- 相手の業種・役職から想定される課題に自然に触れる\n\n'

    + '【件名のルール】\n'
    + '相手の業種・課題を具体的に入れること\n'
    + '例: 「【製造業向け】AI活用で年間528時間削減した事例のご紹介」\n'
    + '例: 「先日の○○でのお話の続きをさせていただきたく」\n\n'

    + '【出力形式】\n'
    + '以下のJSON形式のみで出力すること（前後に余分なテキスト・コードブロック不要）:\n'
    + '{"subject": "件名", "body": "本文"}\n\n'
    + '本文の段落区切りは \\n\\n（空行）で行うこと。\n'
    + '署名は以下を必ず末尾に入れること:\n'
    + '---\n龍竹一生（りょうちく かずい）\n株式会社ライフタイムサポート\nTEL: 070-1298-0180\nEmail: ryouchiku@life-time-support.com'
  );
}

// ============================================================
// Claude API 呼び出し
// ============================================================
function callClaudeAPI(prompt) {
  try {
    var apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
    if (!apiKey) {
      Logger.log('ERROR: CLAUDE_API_KEY が設定されていません');
      return null;
    }

    var payload = {
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        { role: 'user', content: prompt }
      ]
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
    var code = response.getResponseCode();

    if (code !== 200) {
      Logger.log('API Error ' + code + ': ' + response.getContentText());
      return null;
    }

    var json = JSON.parse(response.getContentText());
    return json.content[0].text.trim();

  } catch (e) {
    Logger.log('callClaudeAPI Error: ' + e.toString());
    return null;
  }
}

// ============================================================
// AIレスポンスのパース（JSONを抽出）
// ============================================================
function parseEmailResponse(text) {
  // そのままパース
  try {
    var parsed = JSON.parse(text);
    if (parsed.subject && parsed.body) return parsed;
  } catch (e) {}

  // コードブロック内のJSONを抽出
  var codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) {
    try {
      var parsed = JSON.parse(codeMatch[1].trim());
      if (parsed.subject && parsed.body) return parsed;
    } catch (e) {}
  }

  // { ... } を直接抽出
  var jsonMatch = text.match(/\{[\s\S]*"subject"[\s\S]*"body"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      var parsed = JSON.parse(jsonMatch[0]);
      if (parsed.subject && parsed.body) return parsed;
    } catch (e) {}
  }

  Logger.log('parseEmailResponse: パース失敗\n' + text);
  return null;
}

// ============================================================
// メール編集内容を保存
// ============================================================
function updateEmail(row, subject, body) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  sheet.getRange(row, 17).setValue(subject); // Q
  sheet.getRange(row, 18).setValue(body);    // R
  sheet.getRange(row, 19).setValue('下書き済'); // S
  sheet.getRange(row, 26).setValue(new Date()); // Z
  return { success: true, message: '保存しました' };
}

// ============================================================
// メール送信
// ============================================================
function sendEmail(row) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  var r = sheet.getRange(row, 1, 1, 32).getValues()[0];

  var toEmail  = String(r[4]  || ''); // E
  var name     = String(r[3]  || ''); // D
  var company  = String(r[0]  || ''); // A
  var subject  = String(r[16] || ''); // Q
  var body     = String(r[17] || ''); // R

  if (!toEmail) return { success: false, message: 'メールアドレスが未設定です' };
  if (!subject) return { success: false, message: 'メール件名が未設定です。先にAI生成または手動入力してください。' };
  if (!body)    return { success: false, message: 'メール本文が未設定です。先にAI生成または手動入力してください。' };

  try {
    GmailApp.sendEmail(toEmail, subject, body, {
      name:    SENDER_NAME,
      replyTo: SENDER_EMAIL
    });

    sheet.getRange(row, 19).setValue('送信済み'); // S
    sheet.getRange(row, 20).setValue(new Date()); // T: 初回送信日
    sheet.getRange(row, 26).setValue(new Date()); // Z: 最終更新日

    return { success: true, message: company + ' ' + name + ' 様へ送信しました' };

  } catch (e) {
    Logger.log('sendEmail Error: ' + e.toString());
    return { success: false, message: '送信エラー: ' + e.message };
  }
}

// ============================================================
// 一括送信
// ============================================================
function bulkSend(rows) {
  var sent = 0;
  var errors = [];

  for (var i = 0; i < rows.length; i++) {
    var result = sendEmail(rows[i]);
    if (result.success) {
      sent++;
    } else {
      errors.push('行' + rows[i] + ': ' + result.message);
    }
    Utilities.sleep(300); // レート制限対策
  }

  var msg = sent + '件送信完了';
  if (errors.length > 0) msg += '（' + errors.length + '件エラー: ' + errors.join(', ') + '）';
  return { success: true, message: msg };
}

// ============================================================
// フェーズ更新
// ============================================================
function updatePhase(row, type, phase) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  // type === 'aiSeminar' → AB列 (28列目)
  // type === 'sales'     → X列  (24列目)
  var col = (type === 'aiSeminar') ? 28 : 24;

  sheet.getRange(row, col).setValue(phase);
  sheet.getRange(row, 26).setValue(new Date()); // Z: 最終更新日
  return { success: true, message: 'フェーズを更新しました' };
}
