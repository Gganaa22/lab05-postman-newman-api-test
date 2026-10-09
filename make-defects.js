// lab05-defects.json үүсгэнэ: server.js-ийн согогийг илрүүлэх тестүүд.
// Эдгээр тест ЗОРИУДААР унана (сервер буруу ажиллаж байгаагийн нотолгоо).
const fs = require('fs');
const url = (p) => ({ raw: '{{baseUrl}}/' + p, host: ['{{baseUrl}}'], path: p.split('/') });
const test = (title, code) => `pm.test("${title}", function () {\n    ${code}\n});`;
const req = (name, method, path, body, code) => ({
  name,
  request: {
    method,
    header: body ? [{ key: 'Content-Type', value: 'application/json' }] : [],
    url: url(path),
    ...(body && { body: { mode: 'raw', raw: JSON.stringify(body), options: { raw: { language: 'json' } } } }),
  },
  ...(code && { event: [{ listen: 'test', script: { type: 'text/javascript', exec: code.split('\n') } }] }),
});
const setupOk = test('Setup амжилттай: статус 200', 'pm.response.to.have.status(200);');
const student = (id) => req('Setup: оюутан', 'PUT', 'students/' + id, { status: 'active', coursesTaken: [] }, setupOk);
const course = (id) => req('Setup: хичээл', 'PUT', 'courses/' + id, { prerequisites: [] }, setupOk);
const reg = (name, body, code) => req(name, 'POST', 'registrations', body, code);
const noStudent = (id) => reg('Бүртгүүлэх', { studentID: id, courseID: 'd_course' },
  test(`studentID ${id} системд байхгүй тул ERROR_NO_STUDENT`,
       'pm.expect(pm.response.json().result).to.eql("ERROR_NO_STUDENT");'));
const folder = (name, item) => ({ name, item });
const items = [
  folder('Д1: studentID __proto__ → ERROR_NO_STUDENT байх ёстой', [course('d_course'), noStudent('__proto__')]),
  folder('Д2: studentID constructor → ERROR_NO_STUDENT байх ёстой', [course('d_course'), noStudent('constructor')]),
  folder('Д3: studentID toString → ERROR_NO_STUDENT байх ёстой', [course('d_course'), noStudent('toString')]),
  folder('Д4: нэг оюутан нэг хичээлд давхар бүртгүүлж болохгүй', [
    student('d4_s'), course('d4_c'),
    reg('Эхний бүртгэл', { studentID: 'd4_s', courseID: 'd4_c' },
      test('Эхний бүртгэл: статус 201', 'pm.response.to.have.status(201);')),
    reg('Давхар бүртгэл', { studentID: 'd4_s', courseID: 'd4_c' },
      test('Давхар бүртгэл 201-ээр амжилттай болох ёсгүй', 'pm.expect(pm.response.code).to.not.eql(201);')),
  ]),
  // Сервер унадаг тул хамгийн СҮҮЛД байрлуулна
  folder('Д5: courseID constructor → ERROR_NO_COURSE байх ёстой (сервер унана)', [
    student('d5_s'),
    reg('Бүртгүүлэх', { studentID: 'd5_s', courseID: 'constructor' }, [
      test('courseID constructor: статус 200', 'pm.response.to.have.status(200);'),
      test('courseID constructor: result = ERROR_NO_COURSE', 'pm.expect(pm.response.json().result).to.eql("ERROR_NO_COURSE");'),
    ].join('\n')),
  ]),
];
const c = {
  info: { name: 'Lab05-defects', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  item: items,
  variable: [{ key: 'baseUrl', value: 'http://localhost:3000', type: 'string' }],
};
fs.writeFileSync('lab05-defects.json', JSON.stringify(c, null, 2), 'utf8');
console.log('lab05-defects.json үүслээ');