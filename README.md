# Лаборатори 5: API систем тест — Postman ба Newman

- **Оюутны нэр**: Д.Гантогтох
- **Оюутны код**: B242270139

## Орчин

```
PS> node -v
v22.14.0
PS> newman -v
6.2.2
```

## Даалгавар 2: Тест дизайн

Тестлэгдэх функц: `POST /registrations` (хичээлд бүртгүүлэх).

### Сонголт ба төлөөлөх утга

Тест бүр өөрийн setup-ийг PUT-аар хийх тул өөр өөр ID ашиглана.

| Сонголт | Эквивалент анги | Төлөөлөх утга |
| --- | --- | --- |
| Оюутан | идэвхтэй | `S_ok`, `status: "active"` |
| | идэвхгүй | `S_off`, `status: "inactive"` |
| | байхгүй | `S_ghost` (PUT хийхгүй) |
| Оюутны үзсэн хичээл | урьдачийг бүгдийг хангана | `["CS201"]` (хичээлд `["CS201"]`) |
| | зарим нь | `["CS201"]` (хичээлд `["CS201","CS202"]`) |
| | огт үзээгүй | `[]` (хичээлд `["CS201"]`) |
| Хичээл | байгаа | `C_ok` |
| | байхгүй | `C_ghost` (PUT хийхгүй) |
| Хичээлийн урьдач нөхцөл | урьдачтай | `["CS201"]` |
| | урьдачгүй | `[]` |
| Хүсэлтийн формат | зөв JSON | бүх талбартай |
| | талбар дутуу | `courseID` байхгүй |
| | буруу JSON | `{bad` |

Collection-д тест бүр өөр ID ашигладаг (s01/c01, s02_ghost, ...), дээрх нэрс нь зөвхөн төлөөлөх утгын төрлийг заана.

### Спецификацийн хүснэгт

Серверийн шалгах дараалал: талбар дутуу эсэх, оюутан байгаа эсэх, идэвхтэй эсэх, хичээл байгаа эсэх, урьдач.

| № | Спецификаци | Оролт | Хүлээгдэх статус | Хүлээгдэх result |
| --- | --- | --- | --- | --- |
| 1 | Happy path | идэвхтэй оюутан, `["CS201"]` үзсэн, хичээл `["CS201"]` | 201 | `OK`, registrationID тоо |
| 2 | Оюутан байхгүй | `S_ghost`, байгаа хичээл | 200 | `ERROR_NO_STUDENT` |
| 3 | Идэвхгүй оюутан | `inactive`, урьдач хангасан | 200 | `ERROR_INACTIVE_STUDENT` |
| 4 | Хичээл байхгүй | идэвхтэй оюутан, `C_ghost` | 200 | `ERROR_NO_COURSE` |
| 5 | Урьдач огт хангаагүй | `[]` үзсэн, хичээл `["CS201"]` | 200 | `ERROR_PREREQUISITES`, missing `["CS201"]` |
| 6 | Урьдач зарим нь дутуу | `["CS201"]` үзсэн, хичээл `["CS201","CS202"]` | 200 | `ERROR_PREREQUISITES`, missing `["CS202"]` |
| 7 | Давхар алдаа: идэвхгүй оюутан + хичээл байхгүй | `inactive`, `C_ghost` | 200 | `ERROR_INACTIVE_STUDENT` |
| 8 | Давхар алдаа: оюутан байхгүй + хичээл байхгүй | `S_ghost`, `C_ghost` | 200 | `ERROR_NO_STUDENT` |
| 9 | Хязгаар: урьдачгүй хичээл, хоосон coursesTaken | `[]`, `[]` | 201 | `OK`, registrationID тоо |
| 10 | Хязгаар: courseID талбар дутуу | зөвхөн studentID | 400 | `ERROR_BAD_REQUEST` |
| 11 | Буруу JSON | `{bad` | 400 | `ERROR_BAD_JSON` |

## Newman гаралтын нэгтгэл

| Төлөв | Файл | Collection | Requests (executed / failed) | Assertions (executed / failed) | Exit code |
| --- | --- | --- | --- | --- | --- |
| PASS | `results/newman-pass.txt` | `lab05-collection.json` | 27 / 0 | 44 / 0 | 0 |
| FAIL | `results/newman-fail.txt` | `lab05-collection-fail.json` | 27 / 0 | 44 / 1 | 1 |
| DOWN | `results/newman-down.txt` | `lab05-collection.json` | 27 / 27 | 44 / 44 | 1 |

### Interface алдаа ба Oracle алдааны ялгаа

- **FAIL (oracle алдаа):** сервер ажиллаж хариу өгсөн боловч Т03-ийн хүлээгдэх `result`
  (`ERROR_NO_STUDENT`) бодит хариу (`ERROR_INACTIVE_STUDENT`)-той таарсангүй. Зөвхөн
  энэ нэг assertion унасан тул 1 failed, requests failed 0.
- **DOWN (interface алдаа):** сервер унтарсан үед бүх 27 request `ECONNREFUSED`-ээр унаж,
  хариу ирээгүй. Тест script ажилласан ч хариу байхгүй тул 44 assertion бүгд унасан.

`lab05-collection-fail.json`-ыг `make-fail.js` скриптээр `lab05-collection.json`-оос
үүсгэсэн: бүтэн collection-ий хуулбар, зөвхөн Т03-ийн нэг oracle өөрчлөгдсөн.


## Тестээр илрүүлсэн согог (`lab05-defects.json`)

Үндсэн collection нь pass байх ёстой тул согог илрүүлэх тестүүдийг тусдаа
`lab05-defects.json`-д хийж (`make-defects.js` скриптээр үүсгэсэн),
`results/newman-defects.txt`-д хадгалсан. Эдгээр тест зориуд унана.

| № | Оролт | Хүлээгдэх | Бодитоор |
| --- | --- | --- | --- |
| Д1-Д3 | `studentID` = `__proto__`, `constructor`, `toString` (PUT хийгээгүй) | `ERROR_NO_STUDENT` | `ERROR_INACTIVE_STUDENT` |
| Д4 | нэг оюутныг нэг хичээлд 2 удаа бүртгэх | 2 дахь нь татгалзана | 2 дахь нь ч `201`, `registrationID` нэмэгдсэн |
| Д5 | `courseID` = `constructor` | `ERROR_NO_COURSE` | сервер унасан: `TypeError: Cannot read properties of undefined (reading 'filter')` |

Newman үр дүн: requests 12 executed / 1 failed, assertions 13 executed / 6 failed,
exit code 1. Д5 серверийг унагаадаг тул collection-ий хамгийн сүүлд байрлуулсан.

Нэмэлт: PowerShell-ээр (`Invoke-RestMethod`) гараар шалгахад body нь `null` үед сервер
`Cannot destructure property 'studentID' of 'data' as it is null` алдаагаар унадаг.
Мөн `courseID` нь `toString`, `__proto__` үед `constructor`-той адил унана.
Эдгээрийг collection-д оруулаагүй (нэг ажиллуулалтад нэг л унах боломжтой).

Шалтгаан: `students`, `courses` нь энгийн `{}` object тул `students["constructor"]`
нь prototype-ийн утгыг буцаадаг. Давхар бүртгэлийн хувьд `registrations`-д
`studentID + courseID` давхцлыг шалгадаггүй.

## Дүгнэлт

Дизайны 5 алхмаас хамгийн их бодол шаардсан нь хүлээгдэх утгыг (oracle) тодорхойлох алхам байлаа.
Ялангуяа давхар алдаа үед аль `result` буцахыг заавар заагаагүй тул `server.js`-ийн
шалгах дарааллыг уншиж, оюутны шалгалт хичээлийнхээс түрүүлдэг гэж таамаглаад тестээр баталгаажуулсан.
Идэвхгүй оюутан + байхгүй хичээл `ERROR_INACTIVE_STUDENT`, байхгүй оюутан + байхгүй хичээл
`ERROR_NO_STUDENT` буцдаг нь тэр таамаглалыг батлав.
Боломжгүй хослол ч таарсан: байхгүй оюутанд `coursesTaken` байхгүй тул
"байхгүй оюутан + урьдач хангасан" гэсэн хослол утгагүй, мөн талбар дутуу үед
дараагийн шалгалтууд хүртэл хүрдэггүй.
Тест бүрийг бие даасан болгохын тулд өөр өөр ID ашиглаж, setup PUT-ийг тест бүрдээ хийсэн,
`registrationID`-ийн яг утгыг шалгалгүй зөвхөн тоо мөн эсэхийг шалгасан.
PASS ажиллуулалт 44 assertion, 0 failed, exit 0 байсан бол зөвхөн нэг oracle-ийг өөрчилсөн
FAIL collection 44-өөс 1 нь унаж exit 1 болсон нь oracle алдааны жишээ юм.
DOWN үед бүх 27 request `ECONNREFUSED`-ээр унасан нь холболтын (interface) алдаа тул oracle
алдаатай ялгаатай. Тестүүд серверийн бодит согог олсон: `__proto__`, `constructor`,
`toString` ID-г оюутан гэж андуурч `ERROR_INACTIVE_STUDENT` буцаах, нэг оюутныг нэг хичээлд
давхар бүртгэх, `constructor` гэсэн `courseID` болон `null` body дээр сервер унах.
Үүнээс тестийн зорилго бүх тестийг pass болгох биш, согог олох гэдгийг ойлгосон.
`students`, `courses`-ийг `Map` болгож (эсвэл `Object.hasOwn`-оор шалгаж), давхар бүртгэлийг
шалгаж, body-г `null` эсэхийг шалгавал эдгээр согогийг засаж болно.