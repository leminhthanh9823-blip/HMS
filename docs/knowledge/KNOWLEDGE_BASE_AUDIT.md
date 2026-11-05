# Báo cáo audit Knowledge Base HMS

Ngày audit: 04/11/2026. Phạm vi: `AGENTS.md`, toàn bộ Markdown trong `docs/knowledge/`, và 7 PDF trong `docs/source/`. Audit chỉ sửa Knowledge Base; không thay đổi PDF, không tạo code ứng dụng, database hay migration.

## Kết luận

- Cả 7 PDF, tổng 176 trang, đều đã được lập chỉ mục và có nội dung tương ứng trong Knowledge Base.
- Đủ 19 module `[C]` ở cấp project brief; FO-NA được tách thành tài liệu submodule, nên có 20 file module.
- Đối chiếu được 206 FR có định nghĩa, 78 BR, 49 OQ, 25 NFR, 8 BG, 21 RC và 33 ASM. Hai ID FR khác chỉ là tham chiếu mồ côi, không phải FR đã định nghĩa.
- Không có liên kết Markdown hỏng, không có module chính thức bị thiếu và không thấy ID FR đã định nghĩa bị trùng.
- Không có đề xuất stack/deployment/UI nào còn được ghi như quyết định stakeholder đã duyệt. Hiện chưa có bằng chứng quyết định stakeholder đã ký trong 7 PDF.
- Tổng cộng 14 phát hiện: **4 Nghiêm trọng, 6 Cần sửa, 4 Cải thiện**. Knowledge Base đã được sửa cho 10 phát hiện; 7 vấn đề vẫn cần BA/PO/stakeholder xác nhận hoặc tài liệu nguồn bổ sung (một phát hiện có thể vừa được giảm rủi ro trong KB vừa còn tồn tại ở nguồn).

## Phương pháp và kiểm tra tự động

1. Trích văn bản theo từng trang PDF, giữ ranh giới trang.
2. So sánh tập ID giữa PDF và Knowledge Base; kiểm tra riêng FR/BR/OQ/NFR/BG/RC/ASM.
3. Kiểm tra mọi liên kết Markdown tương đối.
4. Đối chiếu trang nguồn của toàn bộ hàng trong `BUSINESS_RULES.md` và `OPEN_QUESTIONS.md`; không phát hiện hàng nào dẫn tới trang không chứa ID tương ứng.
5. Đọc mẫu các bảng FR, BR, OQ, assumption, self-review và race condition để kiểm tra con số, điều kiện, ngoại lệ và trạng thái.

## Độ bao phủ theo nguồn

| PDF | Nội dung đã phản ánh | Kết quả |
|---|---|---|
| `HMS_Tai-lieu-BA_Phan-1_v0.2.pdf` | mục tiêu, 19 module, BR/NFR khung, 12 OQ Blocking và OQ-001–040, roadmap | Đủ; nguồn chính của overview/rules/open questions |
| `HMS_Tai-lieu-BA_Phan-2_v0.1.pdf` | 59 FR của CFG/PROP/ROOM/RBAC/EMP/AUD, role matrix, NFR-SEC-101–114, BR/OQ bổ sung | Đủ |
| `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf` | 75 FR của RATE/BOOK/CAL/GST/PAY/INV, RC-01–12, BR-110/120/130/131, OQ-047–050 | Đủ |
| `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf` | 72 FR của FO/FO-NA/HK/MNT/PAY/INV, RC-13–21, BR/OQ bổ sung | Đủ, nhưng có lỗi tham chiếu nguồn được ghi dưới đây |
| `hms-de-xuat-cong-nghe.pdf` | stack, crypto, deployment và cut-over đề xuất | Được giữ là đề xuất, không phải quyết định |
| `hms-de-xuat-trien-khai.pdf` | giải pháp nghiệp vụ/kỹ thuật và kế hoạch go-live đề xuất | Được giữ là đề xuất, không phải quyết định |
| `hms-de-xuat-giao-dien-v2.pdf` | TailAdmin, React/Next.js, navigation, màu trạng thái và masking đề xuất | Được giữ là đề xuất, không phải quyết định |

AST, NTF, RPT và CHN chỉ có phạm vi cấp module vì BA Phần 4 hẹn đặc tả ở Phần 5 chưa tồn tại. Đây là khoảng trống của nguồn, không phải nội dung bị bỏ sót khi tóm tắt. (`HMS_Tai-lieu-BA_Phan-4_v0.1.pdf`, §11.6, p.37.)

## Đối chiếu độ chính xác mẫu

| Nội dung | Kết quả đối chiếu | Nguồn PDF |
|---|---|---|
| BR-010 | đúng: tối đa một RoomNight hiệu lực cho `(room, stay_date)`, gồm booking/OOO/day-use, cưỡng chế DB | `HMS_Tai-lieu-BA_Phan-1_v0.2.pdf`, §7.1, p.16 |
| BR-012 | đúng: tách `hold_expires_at` và `deposit_due_at`; expired hold bị loại ngay cả khi job chưa chạy | cùng PDF, §7.1, p.16 |
| BR-014 | đúng: Conflict không sinh RoomNight và không làm sold vượt capacity; vẫn `[Q]` OQ-005 | cùng PDF, §7.1, p.17 |
| BR-021 | đúng: snapshot khi Confirmed; khách sạn đổi giữ giá, khách đổi tính lại và kiểm tra rate condition | cùng PDF, §7.1, p.18 |
| BR-031 | đúng thứ tự: ghi phí hủy → bù cọc → hoàn/GuestCredit phần dư | cùng PDF, §7.1, p.19 |
| BR-038 | đúng: ảnh chuyển khoản không phải căn cứ; Pending không tính đủ cọc/quyết toán | cùng PDF, §7.1, p.20 |
| BR-040 | đúng: folio bất biến; sửa bằng void/adjustment, quyền + lý do + maker-checker | cùng PDF, §7.1, p.20 |
| BR-051 | đúng: Vacant, không OOO, đạt Clean/Inspected; override Manager có audit/KPI | cùng PDF, §7.1, p.21 |
| BR-061 | đúng nhãn `[C]` của nguồn và yêu cầu audit before/after, append-only, masking | cùng PDF, §7.1, p.22 |
| BR-064 | đúng: maker khác checker, ngoại lệ Owner có lý do, remote approval cần 2FA | cùng PDF, §7.1, p.23 |
| BR-110 | đúng: vô hiệu hold quá hạn trên đúng tập inventory trước khi ghi | `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf`, §11.2, p.39 |
| BR-130 | định nghĩa KB đúng theo Phần 3: thiếu cọc sau Confirmed chỉ gắn cờ/đưa vào danh sách thu; Phần 4 mô tả sai ở §11.4 | `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf`, §11.2, p.40; `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf`, §11.4, p.37 |
| BR-134 | đúng điều kiện duy nhất `(booking_room, stay_date)`; nhãn `[C]` nhưng nằm trong draft chưa baseline | `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf`, §§0, 11.2, pp.1, 36 |
| BR-135/136 | đúng: một ca mở/người/cơ sở; refund về đúng kênh/người, ngoại lệ cần Owner | cùng PDF, §§5.3, 11.2, pp.23, 36 |
| FR totals | đúng: 59 + 75 + 72 = 206 FR có định nghĩa | BA Phần 2 §10 p.40; Phần 3 §11 p.39; Phần 4 §11 pp.35–36 |

Không tự điền nội dung cho hai FR mồ côi hoặc các tham chiếu sai; chúng được chuyển thành vấn đề xác nhận.

## Phát hiện — Nghiêm trọng (4)

| ID | File liên quan | Bằng chứng | Khắc phục/trạng thái |
|---|---|---|---|
| S-01 | `REQUIREMENTS_INDEX.md`, `OPEN_QUESTIONS.md`, `MODULES/INV.md` | `FR-INV-015` và `FR-INV-018` chỉ xuất hiện trong assumption table Phần 4 pp.2–3; không có định nghĩa, trong khi INV Phần 4 dùng 101–113 | Đã ghi rõ là orphan và loại khỏi tổng 206; vẫn cần PO/BA chỉ ra ID đúng |
| S-02 | `MODULES/INV.md`, `OPEN_QUESTIONS.md` | FR-INV-106 tại Phần 4 p.26 dẫn `OQ-034`, nhưng OQ-034 tại Phần 1 p.35 nói về guest/blacklist | Đã bỏ cách hiểu sai khỏi module và ghi vấn đề; cần PO/BA sửa cross-reference |
| S-03 | `BUSINESS_RULES.md`, `OPEN_QUESTIONS.md` | BR-130 được định nghĩa là thiếu cọc sau Confirmed ở Phần 3 p.40; Phần 4 p.37 lại gọi là hoàn theo snapshot | KB giữ định nghĩa gốc và ghi mâu thuẫn; cần PO/BA sửa Phần 4 |
| S-04 | `DECISIONS.md`, `PROJECT_INDEX.md` | BR-134 mang `[C]` nhưng Phần 4 p.1 ghi Draft/chưa baseline và p.36 gọi là đề xuất bổ sung; tiêu đề cũ dễ tạo cảm giác đã duyệt | Đã tách “source-marked `[C]`” khỏi stakeholder approval và ghi rõ chưa có quyết định được ký |

## Phát hiện — Cần sửa (6)

| ID | File liên quan | Bằng chứng | Khắc phục/trạng thái |
|---|---|---|---|
| F-01 | `REQUIREMENTS_INDEX.md` | dải ID compact khiến tìm `FR-CFG-002`, các NFR/RC/ASM cụ thể không thấy trong KB | Đã thêm manifest tìm kiếm đủ 206 FR, 25 NFR, 21 RC và 33 ASM |
| F-02 | `MODULES/CFG.md` | mô tả cũ nói FR-CFG có “property bank accounts”, nhưng FR-CFG-001–012 pp.3–4 không có yêu cầu này | Đã xóa nội dung không có nguồn và thay bằng đúng catalog/template/cleanliness controls |
| F-03 | `PROJECT_INDEX.md`, toàn KB | citation dùng alias “BA Part 1” nhưng chưa ánh xạ rõ tới tên file, trái với kỳ vọng truy ngược tên PDF | Đã thêm bảng ánh xạ alias → chính xác 7 filename |
| F-04 | `AGENTS.md` | câu cập nhật KB cũ có thể bị hiểu là cập nhật cả thay đổi chưa xác nhận | Đã yêu cầu chỉ cập nhật quyết định đã xác nhận/user cung cấp; nội dung chưa xác nhận vào `OPEN_QUESTIONS.md` |
| F-05 | `TERMINOLOGY.md`, `PROJECT_INDEX.md` | các thuật ngữ RoomNight, Conflict, Pending/Matched, AR, PendingCharge… rải rác, khó tra cứu | Đã tạo glossary ngắn có nguồn và liên kết từ index |
| F-06 | `OPEN_QUESTIONS.md`, `MODULES/PAY.md` | FR-PAY-107 p.22 dẫn BR-043/045 trong khi §5.3 p.23 cũng áp dụng BR-040 cho correction/reversal | Đã ghi vấn đề, chưa tự chọn canonical BR; cần PO/BA xác nhận |

## Phát hiện — Cải thiện (4)

| ID | File liên quan | Bằng chứng | Khắc phục/trạng thái |
|---|---|---|---|
| I-01 | nhiều file KB | phần lớn citation có file alias + trang nhưng không phải hàng nào cũng ghi số mục | Các phát hiện/thuật ngữ quan trọng đã bổ sung mục; nên tăng dần section khi file được chỉnh, không cần làm dài toàn bộ KB |
| I-02 | `MODULES/AST.md`, `NTF.md`, `RPT.md`, `CHN.md` | chưa có FR chi tiết vì BA Phần 5 chưa tồn tại | Giữ module stub và đánh dấu nguồn thiếu; cần BA Phần 5 trước implementation |
| I-03 | `REQUIREMENTS_INDEX.md` | US/AC/TC/ERR và nội dung 21 RC không được sao chép đầy đủ | Giữ chiến lược token thấp: manifest + trang nguồn; khi thiết kế/test một module phải đọc đúng trang PDF được dẫn |
| I-04 | `PROJECT_INDEX.md` | index cũ chưa hướng dẫn bộ file tối thiểu theo loại nhiệm vụ | Đã thêm bảng “Minimal reading by task”; index vẫn ở mức ngắn gọn |

## Trạng thái quyết định và đề xuất

- `[C]` là nhãn của BA theo quy ước nguồn; không tự động đồng nghĩa đã có biên bản stakeholder phê duyệt.
- BA Phần 2–4 đều tự ghi Draft/chưa baseline. (`HMS_Tai-lieu-BA_Phan-2_v0.1.pdf`, §0.1, p.1; `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf`, §0.1, p.1; `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf`, §0, p.1.)
- PostgreSQL, NestJS, Redis/BullMQ, React/Next.js, TailAdmin, Flutter/React Native, Kubernetes/ECS, mô hình single-tenant, pilot bốn tuần và các ASM vẫn là đề xuất/giả định.
- `DECISIONS.md` hiện ghi rõ chưa có bằng chứng quyết định stakeholder đã ký; các lựa chọn kỹ thuật vẫn nằm trong `ARCHITECTURE.md`/`OPEN_QUESTIONS.md`.

## Token và hướng dẫn cho Codex

- `AGENTS.md`: khoảng 158 từ, đủ ngắn và chứa đủ bốn guardrail: đọc index, đọc theo nhu cầu, tra PDF khi thiếu, không tự quyết OQ/không tự code.
- `PROJECT_INDEX.md`: khoảng 560 từ sau audit; phần tăng thêm là ánh xạ nguồn và task routing, giúp giảm số file cần đọc ở các lượt sau.
- Mỗi file module chỉ khoảng 70–130 từ; không file nào sao chép toàn bộ PDF. Nội dung lặp chủ yếu là ID/rule links cần thiết để tra cứu.
- `BUSINESS_RULES.md` dài hơn vì là catalog trung tâm; không nên nạp cho nhiệm vụ không liên quan nghiệp vụ chéo.

Luồng đọc khuyến nghị: `PROJECT_INDEX` → đúng module → chỉ thêm `BUSINESS_RULES`/`REQUIREMENTS_INDEX`/`OPEN_QUESTIONS` theo nhiệm vụ → PDF đúng trang khi cần wording/AC/TC hoặc khi KB báo thiếu/mâu thuẫn.

## Vấn đề còn tồn đọng cần xác nhận

1. Sửa/ánh xạ `FR-INV-015` và `FR-INV-018`.
2. Sửa cross-reference của FR-INV-106.
3. Sửa mô tả BR-130 tại BA Phần 4 §11.4.
4. Chốt BR canonical cho FR-PAY-107.
5. Trả lời 12 OQ Blocking và các OQ còn lại trong `OPEN_QUESTIONS.md`.
6. Cung cấp/duyệt BA Phần 5 cho AST, NTF, RPT, CHN.
7. Ghi nhận bằng chứng phê duyệt thật sự trước khi đưa bất kỳ mục nào vào phần stakeholder-approved decisions.

