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