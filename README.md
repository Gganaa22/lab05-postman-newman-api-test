# Лаборатори 5: API систем тест — Postman ба Newman

* **Оюутны нэр**: Д.Гантогтох
* **Оюутны код**: B242270139

## Орчны хувилбарууд

| Хэрэгсэл | Хувилбар |
| --- | --- |
| Node.js | v22.14.0 |
| Newman | v6.2.2 |

---

## Даалгавар 2: Сонголт ба төлөөлөх утгын хүснэгт

### 1. Сонголтууд ба Эквивалент ангиуд

| Сонголт (Factor) | Эквивалент ангиуд (Options) |
| --- | --- |
| **studentID-ийн хүчинтэй байдал** | Идэвхтэй (`status: "active"`), Идэвхгүй (`status: "inactive"`), Системд байхгүй |
| **Оюутны үзсэн хичээлүүд (`coursesTaken`)** | Урьдач нөхцөлийг бүрэн хангасан, Дутуу/хангаагүй, Хоосон массив `[]` |
| **courseID-ийн хүчинтэй байдал** | Системд байгаа, Системд байхгүй |
| **Хичээлийн урьдач нөхцөл (`prerequisites`)** | Урьдач нөхцөлтэй (ж: `["CS201"]`), Урьдач нөхцөлгүй (`[]`) |
| **Request Payload-ийн формат** | Зөв JSON, Талбар дутуу (`studentID` эсвэл `courseID` байхгүй) |

---

## Спецификацийн хүснэгт (8 Спецификаци)

| № | Спецификацийн нэр | Оролт / Тестийн нөхцөл | Хүлээгдэх Status Code | Хүлээгдэх result / Body |
| --- | --- | --- | --- | --- |
| 1 | Happy Path Registration | Active student, prerequisites met | 201 Created | `{"result": "OK"}` ба `registrationID` байна |
| 2 | Non-existent Student | studentID системд байхгүй | 200 OK | `{"result": "ERROR_NO_STUDENT"}` |
| 3 | Inactive Student | studentID байна, гэвч status="inactive" | 200 OK | `{"result": "ERROR_INACTIVE_STUDENT"}` |
| 4 | Non-existent Course | courseID системд байхгүй | 200 OK | `{"result": "ERROR_NO_COURSE"}` |
| 5 | Missing Prerequisites | Course урьдач нөхцөлтэй, оюутан үзээгүй | 200 OK | `{"result": "ERROR_PREREQUISITES", "missing": ["CS201"]}` |
| 6 | Double Error Combination | Inactive student + Course байхгүй | 200 OK | `{"result": "ERROR_INACTIVE_STUDENT"}` |
| 7 | Boundary: No Prerequisite | Course урьдач нөхцөлгүй (`[]`), Оюутан үзсэн хичээлгүй (`[]`) | 201 Created | `{"result": "OK"}` ба `registrationID` байна |
| 8 | Bad Request (Missing Field) | Request body-д `courseID` талбар дутуу | 400 Bad Request | `{"result": "ERROR_BAD_REQUEST"}` |

---

## Newman Тестийн Гаралтын Нэгтгэл

| Туршилтын төлөв | Файл | Executed Assertions | Failed Assertions | Exit Code |
| --- | --- | --- | --- | --- |
| **PASS** | `results/newman-pass.txt` | [Туршилтын дараа бөлгөнө] | 0 | 0 |
| **FAIL** | `results/newman-fail.txt` | [Туршилтын дараа бөлгөнө] | ≥ 1 | 1 |
| **DOWN** | `results/newman-down.txt` | 0 | 0 | 1 |

### Интерфейсийн ба Oracle Алдааны Ялгаа
* **Interface Error (`newman-down.txt`)**: Сервер унтарсан үед холболт тогтоож чадахгүй `ECONNREFUSED` алдаа гарна. Энэ нь системтэй харилцах боломжгүйг харуулж буй сүлжээ/интерфейсийн алдаа юм.
* **Oracle Error (`newman-fail.txt`)**: Сервер хэвийн ажиллаж хариу буцаасан боловч бидний тестийн хүлээлттэй (assertion) таараагүй үед гарна. Энэ нь логик болон бизнесийн дүрмийн зөрчлийг харуулна.

---

## Дүгнэлт
