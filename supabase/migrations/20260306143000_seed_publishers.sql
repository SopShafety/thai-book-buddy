-- Seed publishers and booths
do $$ declare pub_id uuid; begin

  insert into publishers (name_th, name_en, category)
    values ('13357', '13357 Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K32');

  insert into publishers (name_th, name_en, category)
    values ('10 มิลลิเมตร', '10mm.Publishing House', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L07');

  insert into publishers (name_th, name_en, category)
    values ('113 (วินทร์ เลียววาริณ)', '113 (Win Lyovarin)', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F32');

  insert into publishers (name_th, name_en, category)
    values ('55 บุ๊คสตอล', '55 Bookstall', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G37');

  insert into publishers (name_th, name_en, category)
    values ('Book Exhibition Tour', 'Book Exhibition Tour', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H15');

  insert into publishers (name_th, name_en, category)
    values ('China Publication', 'China Publication', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H18');

  insert into publishers (name_th, name_en, category)
    values ('Cultural Center of I.R.IRAN', 'Cultural Center of I.R.IRAN', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H16');

  insert into publishers (name_th, name_en, category)
    values ('Deep Publishing By สถาพรบุ๊คส์', 'Deep Publishing By สถาพรบุ๊คส์', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C40');

  insert into publishers (name_th, name_en, category)
    values ('GagaOOLala', 'GagaOOLala', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C35');

  insert into publishers (name_th, name_en, category)
    values ('HAKIKAT BOOKSTORE', 'HAKIKAT BOOKSTORE', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I15');

  insert into publishers (name_th, name_en, category)
    values ('Hytexts เครื่องอ่านหนังสืออิเล็กทรอนิกส์', 'Hytexts E-reader Store', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C24');

  insert into publishers (name_th, name_en, category)
    values ('KINMATON', 'KINMATON', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P02');

  insert into publishers (name_th, name_en, category)
    values ('Kobo by ReaderShip', 'Kobo by ReaderShip', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D30');

  insert into publishers (name_th, name_en, category)
    values ('MAOER', 'MAOER', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H19');

  insert into publishers (name_th, name_en, category)
    values ('MEGAVIZ PUBLISHING CO.', 'MEGAVIZ PUBLISHING CO.', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q01');

  insert into publishers (name_th, name_en, category)
    values ('mocka ข้อสอบเสมือนจริง', 'mocka Mock Exam', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C07');

  insert into publishers (name_th, name_en, category)
    values ('Myanmar Publishers (MPBA)', 'Myanmar Publishers (MPBA)', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H21');

  insert into publishers (name_th, name_en, category)
    values ('New Age Literary Agency', 'New Age Literary Agency', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H23');

  insert into publishers (name_th, name_en, category)
    values ('OHANAMI ART STUDIO', 'OHANAMI ART STUDIO', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S19');

  insert into publishers (name_th, name_en, category)
    values ('Oriental Holy Light', 'Oriental Holy Light', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F21');

  insert into publishers (name_th, name_en, category)
    values ('Picture Books from Taiwan 2026 (台灣繪本在泰國)', 'Picture Books from Taiwan 2026 (台灣繪本在泰國)', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F20');

  insert into publishers (name_th, name_en, category)
    values ('Spirit Guide Foundation', 'Spirit Guide Foundation', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F17');

  insert into publishers (name_th, name_en, category)
    values ('Taiwan Creative Content Agency (TAICCA)', 'Taiwan Creative Content Agency (TAICCA)', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'T', 'T25');

  insert into publishers (name_th, name_en, category)
    values ('VibeMax', 'VibeMax', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B27');

  insert into publishers (name_th, name_en, category)
    values ('You think I print', 'You think I print', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R19');

  insert into publishers (name_th, name_en, category)
    values ('กรมส่งเสริมการเรียนรู้ / กระทรวงศึกษาธิการ', 'Department of Learning Encouragement', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I27');

  insert into publishers (name_th, name_en, category)
    values ('กรองอักษร พับลิชชิ่ง', 'Krong Aksorn', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D32');

  insert into publishers (name_th, name_en, category)
    values ('กรีนรี้ด บาย เอสซีจีพี', 'Green Read by SCGP', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P27');

  insert into publishers (name_th, name_en, category)
    values ('กรู๊ฟ พับลิชชิ่ง', 'Groove Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F31');

  insert into publishers (name_th, name_en, category)
    values ('กองทุนพัฒนาสื่อปลอดภัยและสร้างสรรค์', 'Thai Media Fund', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A22');

  insert into publishers (name_th, name_en, category)
    values ('การท่องเที่ยวแห่งประเทศไทย (อนุสาร อสท.)', 'Tourism Authority of Thailand (TAT)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I13');

  insert into publishers (name_th, name_en, category)
    values ('กิฟท์ บุ๊ค พับลิชชิ่ง', 'Gift Book Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N31');

  insert into publishers (name_th, name_en, category)
    values ('กี วี และ คมคม โปรดักส์', 'KIWI AND KOM-KOM PRODUCTS', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B21');

  insert into publishers (name_th, name_en, category)
    values ('กู๊ด คอนเทนส์', 'Good Contents', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O30');

  insert into publishers (name_th, name_en, category)
    values ('เกมมรดกภูมิปัญญาทางวัฒนธรรม และของเล่นพื้นบ้านไทย 
 โดย กรมส่งเสริมวัฒนธรรม', 'Intangible Cultural Heritage of Thailand Game and Thai folk toys 
 By Department of Cultural promotion Ministry of Culture', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O26');

  insert into publishers (name_th, name_en, category)
    values ('เกมส์ แอนด์ ทอยส์', 'Game &amp; Toys', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R22');

  insert into publishers (name_th, name_en, category)
    values ('แก้วกานต์ + ไพรด์', 'Kaewkarn Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N08');

  insert into publishers (name_th, name_en, category)
    values ('โก๋แก่', 'Kohkae', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A30');

  insert into publishers (name_th, name_en, category)
    values ('โกดังหนังสือ', 'GOHDANG NANGSEU', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q38');

  insert into publishers (name_th, name_en, category)
    values ('ไก่3', 'Kai3', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L44');

  insert into publishers (name_th, name_en, category)
    values ('คบไฟ (โครงการจัดพิมพ์)', 'Kobfai Publishing Project', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G30');

  insert into publishers (name_th, name_en, category)
    values ('คลาสแอคท์และเจคลาส', 'Classact And Jclass', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D34');

  insert into publishers (name_th, name_en, category)
    values ('คัง ซวน วัฒนธรรมและการศึกษา (ไทยแลนด์)', 'Kang Xuan Cultural&amp;Education (Thailand)', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B08');

  insert into publishers (name_th, name_en, category)
    values ('คิดซ์ แอนด์ คิทซ์', 'KIDZ AND KITZ', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S03');

  insert into publishers (name_th, name_en, category)
    values ('คิดาริสตูดิโอ (ไทยแลนด์)', 'KIDARISTUDIO (THAILAND)', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q16');

  insert into publishers (name_th, name_en, category)
    values ('คิโนะคูนิยะ บุ๊คสโตร์ (ประเทศไทย)', 'Kinokuniya Book Stores (Thailand) Co.,Ltd.', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N42');

  insert into publishers (name_th, name_en, category)
    values ('คุ้มอักษรไทย', 'Kumaksornthai', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I24');

  insert into publishers (name_th, name_en, category)
    values ('คู้บ', 'KOOB', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K08');

  insert into publishers (name_th, name_en, category)
    values ('คู่มือนำเที่ยว "เล่มเดียวเที่ยวได้จริง" / เล็ทเทอร์', 'The Letter Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K13');

  insert into publishers (name_th, name_en, category)
    values ('เคล็ดไทย', 'Kledthai', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O16');

  insert into publishers (name_th, name_en, category)
    values ('โคลเวอร์คลับ', 'CLOVERCLUB', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S24');

  insert into publishers (name_th, name_en, category)
    values ('โคลเวอร์บุ๊กสตูดิโอ', 'Cloverbook Studio', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S30');

  insert into publishers (name_th, name_en, category)
    values ('จิ๊กซอว์สเคป', 'JIGSAWSCAPE', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q02');

  insert into publishers (name_th, name_en, category)
    values ('จิณห์นิภา ติวเตอร์', 'Jinnipa Tutor', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D14');

  insert into publishers (name_th, name_en, category)
    values ('เจบุ๊คสโตร์', 'J Book Store', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J30');

  insert into publishers (name_th, name_en, category)
    values ('เจมิไน', 'Gemini', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A42');

  insert into publishers (name_th, name_en, category)
    values ('เจลิต', 'JLIT', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J28');

  insert into publishers (name_th, name_en, category)
    values ('แจ่มใส', 'Jamsai', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F02');

  insert into publishers (name_th, name_en, category)
    values ('ฉลาดเกมกล่อง', 'Chalad Game Klong', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'T', 'T15');

  insert into publishers (name_th, name_en, category)
    values ('ไฉ่หง โนเวล', 'Caihong Novels', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G41');

  insert into publishers (name_th, name_en, category)
    values ('ชัชพลบุ๊คส์', 'Chatchapol Books', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J01');

  insert into publishers (name_th, name_en, category)
    values ('ชันสูตร พับลิชชิ่ง', 'Channasoot Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P07');

  insert into publishers (name_th, name_en, category)
    values ('ชัวร์ก่อนแชร์', 'Sure And Share', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I26');

  insert into publishers (name_th, name_en, category)
    values ('ชาญชัยบุ๊คส์', 'CHANCHAIBOOKS', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G20');

  insert into publishers (name_th, name_en, category)
    values ('ชิลลี่ บุ๊ค สโตร์', 'Chilly Book Store', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R26');

  insert into publishers (name_th, name_en, category)
    values ('ชี้ดาบ', 'Chidahp', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q10');

  insert into publishers (name_th, name_en, category)
    values ('ชี๊ปบุคส์', 'Sheepbooksheepbook', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E15');

  insert into publishers (name_th, name_en, category)
    values ('ซอลท์ พับลิชชิ่ง', 'Salt Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q25');

  insert into publishers (name_th, name_en, category)
    values ('ซัคเซส พับลิชเชอร์', 'Success Publisher', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K30');

  insert into publishers (name_th, name_en, category)
    values ('ซันเดย์ อาฟเตอร์นูน', 'Sunday Afternoon', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I29');

  insert into publishers (name_th, name_en, category)
    values ('ซิมพลิฟาย', 'Reviva-Simplify', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P22');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C21');

  insert into publishers (name_th, name_en, category)
    values ('ซี.ซี.นอลลิดจ์ลิงคส์', 'C.C.KNOWLEDGE LINKS', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H29');

  insert into publishers (name_th, name_en, category)
    values ('ซีเอ็ด', 'SE-ED', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G49');

  insert into publishers (name_th, name_en, category)
    values ('เซนชู พับลิชชิ่ง', 'Zenshu Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N30');

  insert into publishers (name_th, name_en, category)
    values ('เซ้นส์บุ๊คพับลิชชิง', 'Sense Book Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D40');

  insert into publishers (name_th, name_en, category)
    values ('เซเว่นดี บุ๊ค', '7D Book', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M12');

  insert into publishers (name_th, name_en, category)
    values ('แซนด์คล็อคบุ๊คส์', 'SandClock Books', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C03');

  insert into publishers (name_th, name_en, category)
    values ('แซลมอนบุ๊คส์ &amp; ขายหัวเราะ สตูดิโอ', 'Salmon Books &amp; Kaihuaror Studio', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M16');

  insert into publishers (name_th, name_en, category)
    values ('โซฟันชีท', 'sofunsheet', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B07');

  insert into publishers (name_th, name_en, category)
    values ('ณ บ้านวรรณกรรม', 'Na Baanwannagum Group', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F44');

  insert into publishers (name_th, name_en, category)
    values ('ดราก้อนวอร์', 'Dragonwar Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M30');

  insert into publishers (name_th, name_en, category)
    values ('ดรีม เอกซ์เพรส (เดกซ์)', 'Dex [Dream Express]', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S16');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P30');

  insert into publishers (name_th, name_en, category)
    values ('ดวงกมลสมัย', 'DK TODAY', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P15');

  insert into publishers (name_th, name_en, category)
    values ('ด้วงคอมิกส์', 'Beetle comics Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P26');

  insert into publishers (name_th, name_en, category)
    values ('ดวงตะวัน', 'Dbooks', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C34');

  insert into publishers (name_th, name_en, category)
    values ('ด็อกเตอร์มิ้นท์', 'Dr.Mint', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K14');

  insert into publishers (name_th, name_en, category)
    values ('ดอท / กัมบัตเตะ', 'DOT / Ganbatte', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K07');

  insert into publishers (name_th, name_en, category)
    values ('ดับบลิวพี เอ็ดจุเคชั่น มีเดีย', 'W.P. EDUCATION MEDIA', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R20');

  insert into publishers (name_th, name_en, category)
    values ('ดีต่อใจ สำนักพิมพ์', 'Deetorjai Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D33');

  insert into publishers (name_th, name_en, category)
    values ('เดกซ์เพรส พับลิชชิ่ง', 'DEXpress Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q28');

  insert into publishers (name_th, name_en, category)
    values ('เดอะ สตรองโฮลด์ บอร์ดเกม', 'The Stronghold Board Games', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R03');

  insert into publishers (name_th, name_en, category)
    values ('เดอะบุคส์', 'The Books Publishing', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E13');

  insert into publishers (name_th, name_en, category)
    values ('ไดโนคิดส์', 'Dinokids', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C28');

  insert into publishers (name_th, name_en, category)
    values ('ไดฟุกุ ศรีเอเตอร์ / บุ๊คไทม์', 'Daifuku / Book time', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O15');

  insert into publishers (name_th, name_en, category)
    values ('ต้นฉบับ', 'The Original Press', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J18');

  insert into publishers (name_th, name_en, category)
    values ('ตลาดหลักทรัพย์แห่งประเทศไทย', 'Stock Exchange of Thailand', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B26');

  insert into publishers (name_th, name_en, category)
    values ('ตู้หนอนหนังสือ', 'PS Office Furniture', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S29');

  insert into publishers (name_th, name_en, category)
    values ('ไตรภูมิ', 'Traibhumi', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H26');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J11');

  insert into publishers (name_th, name_en, category)
    values ('ทวีสาส์น', 'Samsib Book', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O44');

  insert into publishers (name_th, name_en, category)
    values ('ทาโน่', 'TANO', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S15');

  insert into publishers (name_th, name_en, category)
    values ('ทามะ สตูดิโอ', 'Tama Studio', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R32');

  insert into publishers (name_th, name_en, category)
    values ('ทาวเวอร์ แทคติก เกม', 'Tower Tactic Games', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S02');

  insert into publishers (name_th, name_en, category)
    values ('ทิงค์เน็ต ดีไซน์ สตูดิโอ', 'THiNKNET Design Studio', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M02');

  insert into publishers (name_th, name_en, category)
    values ('ทูยู พับลิชชิ่ง', '2U Publishing', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C27');

  insert into publishers (name_th, name_en, category)
    values ('ไทยควอลิตี้บุ๊คส์ (2006)', 'Thai Qualitybooks (2006)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J40');

  insert into publishers (name_th, name_en, category)
    values ('ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน)', 'Bank of Ayudhya Public Company Limited.', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B23');

  insert into publishers (name_th, name_en, category)
    values ('ธรรมนิติเพรส', 'Dharmniti Press', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M25');

  insert into publishers (name_th, name_en, category)
    values ('ธรรมสภา บันลือธรรม', 'Thammasapa Bunluetham', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q24');

  insert into publishers (name_th, name_en, category)
    values ('ธารปัญญา', 'Tarnpanya', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C08');

  insert into publishers (name_th, name_en, category)
    values ('นนทรัตน์', 'NONTHARAT EDUCATION', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R16');

  insert into publishers (name_th, name_en, category)
    values ('นาคร / ผจญภัย', 'Nakorn / Pajonphai', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O02');

  insert into publishers (name_th, name_en, category)
    values ('นานมี / ทองเกษม', 'Nanmee / Thongkasem', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F16');

  insert into publishers (name_th, name_en, category)
    values ('นานมีบุ๊คส์ / Bloom / AMiCO / LUMI', 'Nanmeebooks / Bloom / AMiCO / LUMI', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D02');

  insert into publishers (name_th, name_en, category)
    values ('นานา นาริศ', 'NANA NARIS', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B32');

  insert into publishers (name_th, name_en, category)
    values ('นาบู x ไทเซย์บุ๊กส์', 'Nabu x Taisei Books', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E42');

  insert into publishers (name_th, name_en, category)
    values ('นาฬิกาทราย', 'Narikasaii Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F41');

  insert into publishers (name_th, name_en, category)
    values ('นีโอ เอ็ดดูเทนเมนท์', 'www.neoedu.co.th', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C01');

  insert into publishers (name_th, name_en, category)
    values ('โนรา', 'Nora', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J20');

  insert into publishers (name_th, name_en, category)
    values ('บ. ไวท์โลตัส', 'White Lotus Co., Ltd.', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G15');

  insert into publishers (name_th, name_en, category)
    values ('บงกช พับลิชชิ่ง', 'Bongkoch Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P40');

  insert into publishers (name_th, name_en, category)
    values ('บจก. ซากุระโปรดัคส์ (ไทยแลนด์)', 'SAKURA PRODUCTS (THAILAND) CO.,LTD.', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q04');

  insert into publishers (name_th, name_en, category)
    values ('บทจร', 'Bodthajorn Limited Partnership', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O06');

  insert into publishers (name_th, name_en, category)
    values ('บริษัท ฐิโอกะ เอ็นเตอร์ไพร์ส จำกัด', 'Teds Play', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R18');

  insert into publishers (name_th, name_en, category)
    values ('บริษัท ปากกาไพล๊อต (ประเทศไทย) จำกัด', 'The pilot pen co. (thailand) Ltd', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S25');

  insert into publishers (name_th, name_en, category)
    values ('บริษัท เลิร์นโอเวท จำกัด', 'Learnovate', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G45');

  insert into publishers (name_th, name_en, category)
    values ('บอร์ดเกม อะไลอันซ์', 'Board Game Alliance', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S07');

  insert into publishers (name_th, name_en, category)
    values ('บ้านฉลาดรู้', 'The Smart House', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R17');

  insert into publishers (name_th, name_en, category)
    values ('บ้านนิยาย', 'Baanniyay', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H30');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S08');

  insert into publishers (name_th, name_en, category)
    values ('บ้านพระอาทิตย์', 'Baan Phra Arthit Publications', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P16');

  insert into publishers (name_th, name_en, category)
    values ('บ้านวายบุ๊ค', 'Baan Y Book', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B35');

  insert into publishers (name_th, name_en, category)
    values ('บ้านศิลปินคลองบางหลวง', 'Artist House Bangkok', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H46');

  insert into publishers (name_th, name_en, category)
    values ('บิงโก', 'Bingo Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E26');

  insert into publishers (name_th, name_en, category)
    values ('บิโทโมะ', 'BITOMO', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S26');

  insert into publishers (name_th, name_en, category)
    values ('บิบลิโอ', 'Biblio', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N16');

  insert into publishers (name_th, name_en, category)
    values ('บีทูเอส / หอมหมื่นลี้ / ลาเวนเดอร์ / แคคตัส', 'B2S / Hommuenlee / Lavender / Cactus', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J50');

  insert into publishers (name_th, name_en, category)
    values ('บุ๊กแด๊นซ์ &amp; โซล พับลิชชิ่ง', 'BOOKDANCE &amp; SOUL PUBLISHING', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H14');

  insert into publishers (name_th, name_en, category)
    values ('บุ๊คกิช เฮ้าส์ และ ไป่เหอ', 'Bookish House Publishing / Baihe Publishing', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D37');

  insert into publishers (name_th, name_en, category)
    values ('บุ๊คสเคป', 'Bookscape', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I02');

  insert into publishers (name_th, name_en, category)
    values ('บุ๊คสโตน', 'Bookstone', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F37');

  insert into publishers (name_th, name_en, category)
    values ('บุ๊คส์ทาวน์', 'Bookstown', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H07');

  insert into publishers (name_th, name_en, category)
    values ('บุ๊คส์เมคเกอร์', 'Booksmaker', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L30');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q20');

  insert into publishers (name_th, name_en, category)
    values ('บุ๊คไอ', 'Booki', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J07');

  insert into publishers (name_th, name_en, category)
    values ('บุรพัฒน์ คอมิคส์ พับลิเคชั่นส์', 'Burapat Comics Publications', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N33');

  insert into publishers (name_th, name_en, category)
    values ('เบเกอรี่บุ๊ค', 'Bakerybook', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C31');

  insert into publishers (name_th, name_en, category)
    values ('เบลลีบัตตัน พับลิชิ่ง', 'BellyButton Publishing', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B28');

  insert into publishers (name_th, name_en, category)
    values ('เบลสซิ่งบุ๊คส์', 'Blessing Books', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B33');

  insert into publishers (name_th, name_en, category)
    values ('แบร์ พับลิชชิ่ง', 'Bear Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D01');

  insert into publishers (name_th, name_en, category)
    values ('โบ บุ๊กส์', 'Beau Books', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A38');

  insert into publishers (name_th, name_en, category)
    values ('ไบโอ เลิร์นนิง แอสเสท', 'Bio Learning Asset', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C02');

  insert into publishers (name_th, name_en, category)
    values ('ประพันธ์สาส์น', 'Praphansarn', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P03');

  insert into publishers (name_th, name_en, category)
    values ('ปัญญาจารย์', 'Panyacharn', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F29');

  insert into publishers (name_th, name_en, category)
    values ('ปิ๊กอะบุ๊ค ไทยแลนด์', 'PICK A BOOK THAILAND', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E20');

  insert into publishers (name_th, name_en, category)
    values ('เป็นหนึ่งสำนักพิมพ์', 'Pen Nueng Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E35');

  insert into publishers (name_th, name_en, category)
    values ('เปเปอร์ยาร์ด', 'Paperyard', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E32');

  insert into publishers (name_th, name_en, category)
    values ('แปลน ฟอร์ คิดส์', 'Plan For Kids', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E08');

  insert into publishers (name_th, name_en, category)
    values ('โปรวิชั่น และ ดีพลัสไกด์', 'Provision &amp; DPLUS Guide', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K21');

  insert into publishers (name_th, name_en, category)
    values ('โปร-วิชั่นเอนเตอร์เทนเมนท์', 'PRO-VISION ENTERTAINMENT', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I41');

  insert into publishers (name_th, name_en, category)
    values ('ไปรษณีย์ไทย', 'Thailand Post', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A46');

  insert into publishers (name_th, name_en, category)
    values ('พ.ศ.พัฒนา', 'P.S.Pattana Publishing', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B09');

  insert into publishers (name_th, name_en, category)
    values ('พะโล้', 'Palo Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S27');

  insert into publishers (name_th, name_en, category)
    values ('พัฒนาคุณภาพวิชาการ (พว.)', 'Patanakhunnapabhwichakarn (PW.)', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D16');

  insert into publishers (name_th, name_en, category)
    values ('พาส เอ็ดดูเคชั่น', 'Pass Education', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B02');

  insert into publishers (name_th, name_en, category)
    values ('พิพิธภัณฑ์การ์ตูนมูนมังงะ', 'Moon Manga Museum', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S21');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R30');

  insert into publishers (name_th, name_en, category)
    values ('พีเอส พับลิชชิ่ง', 'P.S. Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K16');

  insert into publishers (name_th, name_en, category)
    values ('พูนิก้า', 'Punica', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M32');

  insert into publishers (name_th, name_en, category)
    values ('เพ็ญวัฒนา จัดจำหน่าย', 'Pennwattana Distributor', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G42');

  insert into publishers (name_th, name_en, category)
    values ('เพลินแล็บส์', 'PlearnLabs', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B06');

  insert into publishers (name_th, name_en, category)
    values ('เพอร์บุค', 'Purr Book', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B30');

  insert into publishers (name_th, name_en, category)
    values ('เพอลังอิ พับลิชชิ่ง', 'Pelangi Publishing', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R02');

  insert into publishers (name_th, name_en, category)
    values ('ฟรีมายด์ พับลิชชิ่ง', 'FreeMind Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H45');

  insert into publishers (name_th, name_en, category)
    values ('ฟาไฉ / ฟิน', 'FaCai Novels / FIN Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L36');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C29');

  insert into publishers (name_th, name_en, category)
    values ('ฟ้าเดียวกัน', 'Sameskybooks Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J03');

  insert into publishers (name_th, name_en, category)
    values ('ฟีนิกซ์ เน็กซ์', 'Phoenix Next', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'T', 'T26');

  insert into publishers (name_th, name_en, category)
    values ('ฟูลสต๊อป', 'FULLSTOP', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O08');

  insert into publishers (name_th, name_en, category)
    values ('เฟรนด์ชิพ', 'Friendship', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P28');

  insert into publishers (name_th, name_en, category)
    values ('เฟิร์ส เพจ โปร', 'First Page Pro', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S50');

  insert into publishers (name_th, name_en, category)
    values ('เฟิร์สเลิฟ โปร', 'FirstLove Pro', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O29');

  insert into publishers (name_th, name_en, category)
    values ('แฟนตาเซีย', 'Fantasia', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F36');

  insert into publishers (name_th, name_en, category)
    values ('ภัสรสา พับลิชชิ่ง', 'PASRASAA PUBLISHING', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D31');

  insert into publishers (name_th, name_en, category)
    values ('ภาดา เอ็ดดูเคชั่น', 'Pada Education', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G17');

  insert into publishers (name_th, name_en, category)
    values ('ภูมิบัณฑิต', 'Poombundit', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C11');

  insert into publishers (name_th, name_en, category)
    values ('มติชน', 'Matichon', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J02');

  insert into publishers (name_th, name_en, category)
    values ('มอร์แกน พับลิชชิ่ง', 'Morgan Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G31');

  insert into publishers (name_th, name_en, category)
    values ('มะลิ / สเทรแคท ทาโร่ต์', 'Mali / Stray Cat Tarot', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R08');

  insert into publishers (name_th, name_en, category)
    values ('มังกี้บุ๊กส์', 'Monkey Books', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I30');

  insert into publishers (name_th, name_en, category)
    values ('มาตรฐานวรรณกรรมพิมพ์จำกัด', 'Literature : Standard Limited Edition', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C25');

  insert into publishers (name_th, name_en, category)
    values ('มายบุ๊คสโตร์', 'My Bookstore', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B20');

  insert into publishers (name_th, name_en, category)
    values ('มาว มาว บุ๊กส์', 'MAO MAO BOOKS', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D41');

  insert into publishers (name_th, name_en, category)
    values ('มิเนอร์วา บุ๊ค', 'Minerva Book', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E46');

  insert into publishers (name_th, name_en, category)
    values ('มิวเซส', 'Muzes', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B38');

  insert into publishers (name_th, name_en, category)
    values ('มิวเซียมเพรส', 'Museum Press', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K26');

  insert into publishers (name_th, name_en, category)
    values ('มีเดีย แอสโซซิเอตเต็ด', 'Media Associated', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N25');

  insert into publishers (name_th, name_en, category)
    values ('มีบุ๊ค', 'MEBOOK', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E43');

  insert into publishers (name_th, name_en, category)
    values ('มูลนิธิกระจกเงา', 'The Mirror Foundation', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L27');

  insert into publishers (name_th, name_en, category)
    values ('มูลนิธิโครงการตำราสังคมศาสตร์และมนุษยศาสตร์', 'Social Sciences and Humanities Textbooks Foundation', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N29');

  insert into publishers (name_th, name_en, category)
    values ('มูลนิธิโครงการสารานุกรมไทยสำหรับเยาวชนฯ', 'Thai Junior Encyclopedia Foundation', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D28');

  insert into publishers (name_th, name_en, category)
    values ('มูลนิธิเด็ก', 'Foundation for Children', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F26');

  insert into publishers (name_th, name_en, category)
    values ('มูลนิธิมหามกุฏราชวิทยาลัย ในพระบรมราชูปถัมภ์', 'Mahamakuta Rajavidyalaya Foundation Under Royal Patronage', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N26');

  insert into publishers (name_th, name_en, category)
    values ('มูลนิธิหนังสือเพื่อเด็ก', 'Books for Children Foundation', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K25');

  insert into publishers (name_th, name_en, category)
    values ('เมต้า เอ็ดดูเคชั่น', 'Meta Education', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D19');

  insert into publishers (name_th, name_en, category)
    values ('เมืองหนังสือ - ดวงกมล', 'D.K. Book Town', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L32');

  insert into publishers (name_th, name_en, category)
    values ('แม็กพาย บุ๊กส์', 'Magpie Book', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F30');

  insert into publishers (name_th, name_en, category)
    values ('ไมเนอร์ คอร์ปอเรชั่น', 'Minor Corporation', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A08');

  insert into publishers (name_th, name_en, category)
    values ('ยิปซี กรุ๊ป', 'Gypsy Group', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J34');

  insert into publishers (name_th, name_en, category)
    values ('ยืดเปล่า ยืดแต่ไม่ย้วย', 'YUEDPAO', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B29');

  insert into publishers (name_th, name_en, category)
    values ('ยูซีม่า บุ๊ค / ซันฟลาวเวอร์ บุ๊ค', 'Yousima Book / Sunflower Book', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D35');

  insert into publishers (name_th, name_en, category)
    values ('ยูนิเวอร์แซล พับลิชิ่ง', 'Universal Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D38');

  insert into publishers (name_th, name_en, category)
    values ('โยโซระ พับลิชชิ่ง', 'Yozora Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E37');

  insert into publishers (name_th, name_en, category)
    values ('รวมสาส์น (1977)', 'Ruamsarn (1977)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O27');

  insert into publishers (name_th, name_en, category)
    values ('รักพิมพ์ พับลิชชิ่ง', 'Luckpim Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q46');

  insert into publishers (name_th, name_en, category)
    values ('ราตรี', 'Ratree Bookshop', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P08');

  insert into publishers (name_th, name_en, category)
    values ('ร้านภูฟ้า', 'PHUFA', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E28');

  insert into publishers (name_th, name_en, category)
    values ('ร้านรักสยาม หนังสือเก่า', 'lovesiamoldbook', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J23');

  insert into publishers (name_th, name_en, category)
    values ('ร้านหนังสือ ก้าวบรรทัด', 'Kawbanthad Bookshop', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I16');

  insert into publishers (name_th, name_en, category)
    values ('ร้านหนังสือกาลครั้งหนึ่ง', 'Oncebookk', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q21');

  insert into publishers (name_th, name_en, category)
    values ('ร้านหนังสือเก่ารจนา', 'Rochana', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q06');

  insert into publishers (name_th, name_en, category)
    values ('ร้านหนังสือเก่าสุวิมล', 'Thaioldbooks', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J14');

  insert into publishers (name_th, name_en, category)
    values ('ริเวอร์ บุ๊คส์', 'River Books', array['โซนหนังสือต่างประเทศ'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F15');

  insert into publishers (name_th, name_en, category)
    values ('รี้ด วิท มี บุ๊คช็อป', 'Read With Me Bookshop', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N11');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D08');

  insert into publishers (name_th, name_en, category)
    values ('รี้ดดี้ ดิสทริบิวชั่น', 'Ready Distribution', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H11');

  insert into publishers (name_th, name_en, category)
    values ('รุ่งวัฒนา ส่งเสริมรักการอ่าน', 'Rungwattana', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M41');

  insert into publishers (name_th, name_en, category)
    values ('ลองดู', 'Longdo Publishing', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D29');

  insert into publishers (name_th, name_en, category)
    values ('ลาดิดและมูนสเคป', 'Ladys and Moonscape', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K19');

  insert into publishers (name_th, name_en, category)
    values ('ลานละเล่น', 'Lanlalen', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'T', 'T07');

  insert into publishers (name_th, name_en, category)
    values ('ลิลลี่เฮ้าส์', 'lily house.', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M34');

  insert into publishers (name_th, name_en, category)
    values ('ลีเจนดารี่ วอร์เกม', 'Legendary Wargame', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'T', 'T08');

  insert into publishers (name_th, name_en, category)
    values ('ลีฟ ริช', 'Live Rich Books', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M31');

  insert into publishers (name_th, name_en, category)
    values ('เลิร์นนิ่ง สเตชั่น', 'Learning Station', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I44');

  insert into publishers (name_th, name_en, category)
    values ('เลี่ยงเชียง เพียรเพื่อพุทธศาสน์', 'Liang Chiang for Buddhism Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K15');

  insert into publishers (name_th, name_en, category)
    values ('โลกหนังสือ', 'Book World Publishing', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D07');

  insert into publishers (name_th, name_en, category)
    values ('ไลบรารี่ เฮ้าส์', 'Library House', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K17');

  insert into publishers (name_th, name_en, category)
    values ('วังเด็กทอยส์แลนด์', 'Wangdek Toys Land', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R06');

  insert into publishers (name_th, name_en, category)
    values ('วัฒนาพานิช', 'Watanaphanit', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D15');

  insert into publishers (name_th, name_en, category)
    values ('วันเดอร์วาย', 'Onederwhy', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A36');

  insert into publishers (name_th, name_en, category)
    values ('วายซี พับลิชเชอร์', 'YC Publisher', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C33');

  insert into publishers (name_th, name_en, category)
    values ('วายโซซีเคร็ต', 'Ysosecret', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'A', 'A34');

  insert into publishers (name_th, name_en, category)
    values ('วายเอฟคัลเจอร์', 'YF CULTURE', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B22');

  insert into publishers (name_th, name_en, category)
    values ('วารา พับลิชชิ่ง', 'Wara Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O07');

  insert into publishers (name_th, name_en, category)
    values ('วาลิ พับลิชชิ่ง', 'WALI PUBLISHING', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J24');

  insert into publishers (name_th, name_en, category)
    values ('วิญญูชน', 'Winyuchon', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H08');

  insert into publishers (name_th, name_en, category)
    values ('วิบูลย์กิจ', 'Vibulkij', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P31');

  insert into publishers (name_th, name_en, category)
    values ('วิมเมล คลับ', 'Wimmel Club', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B16');

  insert into publishers (name_th, name_en, category)
    values ('วิศวกรน้อย', 'Wisawakorn-Noi', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R15');

  insert into publishers (name_th, name_en, category)
    values ('วีคอมมิคส์', 'WeComics', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B37');

  insert into publishers (name_th, name_en, category)
    values ('วีเลิร์น &amp; น้ำพุสำนักพิมพ์', 'Welearn&amp;Numpu Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R07');

  insert into publishers (name_th, name_en, category)
    values ('วุฒิชัยบุ๊คส์ (ร้าน)', 'Wuttichaibook', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M08');

  insert into publishers (name_th, name_en, category)
    values ('เวลดีไซน์เกม', 'WELL DESIGNED GAME', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'T', 'T12');

  insert into publishers (name_th, name_en, category)
    values ('เวลา', 'Time Publishing House', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N12');

  insert into publishers (name_th, name_en, category)
    values ('เวิร์ด วอนเดอร์', 'Words Wonder', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G46');

  insert into publishers (name_th, name_en, category)
    values ('เวิลด์โอเล็ต', 'WORLD-O-LET', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B36');

  insert into publishers (name_th, name_en, category)
    values ('ไวด์สตอรี่', 'Wide Stories', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B34');

  insert into publishers (name_th, name_en, category)
    values ('ศรีปัญญา', 'Natthakan', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I08');

  insert into publishers (name_th, name_en, category)
    values ('ศูนย์คุณธรรม (องค์การมหาชน)', 'Center for Morality Promotion (Public Organization)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K28');

  insert into publishers (name_th, name_en, category)
    values ('ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน)', 'Princess Maha Chakri Sirindhorn Anthropology Centre', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I06');

  insert into publishers (name_th, name_en, category)
    values ('ศูนย์หนังสือกรมศิลปากร กระทรวงวัฒนธรรม', 'Bookshop, Fine Arts Department, 
 Ministry of Culture.', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G28');

  insert into publishers (name_th, name_en, category)
    values ('ศูนย์หนังสือจุฬาลงกรณ์มหาวิทยาลัย', 'Chulalongkorn University Book Centre', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I32');

  insert into publishers (name_th, name_en, category)
    values ('ศูนย์หนังสือนันท์-นาถ', 'Nun-Nart Islamic Book Center', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C06');

  insert into publishers (name_th, name_en, category)
    values ('สกายบุ๊กส์', 'Skybook', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B18');

  insert into publishers (name_th, name_en, category)
    values ('สตาร์ซอคเก้อร์', 'Stars Soccer', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D05');

  insert into publishers (name_th, name_en, category)
    values ('สตาร์พิคส์ - เล็ดคอมิก', 'Starpics - Let''S Comic', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K42');

  insert into publishers (name_th, name_en, category)
    values ('สเต๊กคอมมิค', 'Steak Comic', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L31');

  insert into publishers (name_th, name_en, category)
    values ('สถาพรบุ๊คส์', 'Satapornbooks', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J41');

  insert into publishers (name_th, name_en, category)
    values ('สนพ.ธิงค์บียอน และ สนพ.อินโฟเพรส', 'Thinkbeyond และ Infopress', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L50');

  insert into publishers (name_th, name_en, category)
    values ('สนพ.ลิตเติลฮาร์ท', 'Little Heart', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E16');

  insert into publishers (name_th, name_en, category)
    values ('สมมติ', 'SM• publishing house', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R23');

  insert into publishers (name_th, name_en, category)
    values ('สมาคมนักเขียนแห่งประเทศไทย', 'Writers'' Association of Thailand (W.A.T.)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M28');

  insert into publishers (name_th, name_en, category)
    values ('สมาคมภาษาและหนังสือแห่งประเทศไทย 
 ในพระบรมราชูปถัมภ์', 'P.E.N. International Thailand Center', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N27');

  insert into publishers (name_th, name_en, category)
    values ('สมาคมส่งเสริมเทคโนโลยี (ไทย-ญี่ปุ่น)', 'Technology Promotion Association (Thailand-Japan)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O01');

  insert into publishers (name_th, name_en, category)
    values ('สมาพันธ์องค์กรเพื่อพัฒนาหนังสือและการอ่าน
 และ สมาคมนักกลอนแห่งประเทศไทย', 'Federation of Organizations 
 for Book Development and Reading Promotion.
 and THE POETS ASSOCIATION OF THAILAND', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J26');

  insert into publishers (name_th, name_en, category)
    values ('สมาร์ท อินฟินิตี้', 'Smart Infinity', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q22');

  insert into publishers (name_th, name_en, category)
    values ('สยามบอร์ดเกม', 'Siam Board Games', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'T', 'T18');

  insert into publishers (name_th, name_en, category)
    values ('สร้างสรรค์บุ๊คส์', 'Sangsanbooks', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q05');

  insert into publishers (name_th, name_en, category)
    values ('สวนเงินมีมา', 'Suan Nguen Mee Ma', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L41');

  insert into publishers (name_th, name_en, category)
    values ('สวนอักษร / อิงค์', 'Suan Aksorn / Ink', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K44');

  insert into publishers (name_th, name_en, category)
    values ('สันสกฤต', 'Sanskrit Book', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N28');

  insert into publishers (name_th, name_en, category)
    values ('สานอักษร', 'Saan Aksorn', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C19');

  insert into publishers (name_th, name_en, category)
    values ('สามัญชน', 'Samanchonbooks', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H42');

  insert into publishers (name_th, name_en, category)
    values ('สายคำ', 'Saicombook', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J08');

  insert into publishers (name_th, name_en, category)
    values ('สารคดี-เมืองโบราณ-ร้านริมขอบฟ้า', 'Sarakadee - MuangBoran - Rimkhobfa Bookstore', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L02');

  insert into publishers (name_th, name_en, category)
    values ('สารพัดบุ๊คสโตร์', 'Salaphat Bookstore', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q08');

  insert into publishers (name_th, name_en, category)
    values ('สำนักงานราชบัณฑิตยสภา', 'Office Of The Royal Society', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R25');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์ เช็ก / เพชรประกาย', 'CZECH / PHETPRAGUY PUBLISHING', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L16');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์ โฟกัส', 'FOCUS', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C17');

  insert into publishers (name_th, name_en, category)
    values ('นักพิมพ์อ่านแล้วรวย', 'ReadandRichPulishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L26');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์ขีดเขียนอะคาเดมี', 'The writer Academy', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E33');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์จุฬาลงกรณ์มหาวิทยาลัย', 'Chulalongkorn University Press', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B14');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์แบร์ฟุตบานาน่า', 'Barefoot Banana', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C15');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์มหาวิทยาลัยนเรศวร', 'Naresuan University Publishing House', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C23');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์มหาวิทยาลัยสุโขทัยธรรมาธิราช', 'The Office of the University Press Sukhothai Thammathirat Open', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G14');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์ไรเตอร์โซล', 'Writer Soul Publisher', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D03');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์ลายเส้น', 'Li-Zenn Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P06');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์สีน้ำ', 'WATER COLOR PUBLISHING', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q27');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์อัล-อีหม่าน', 'AL-IMAN PUBLISHING HOUSE', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J22');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์อ่าน', 'Aan Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L29');

  insert into publishers (name_th, name_en, category)
    values ('สำนักพิมพ์อิงค์ พับลิชชิ่ง', 'ink publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K44');

  insert into publishers (name_th, name_en, category)
    values ('สำนักหอสมุดแห่งชาติ', 'National Library of Thailand', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H28');

  insert into publishers (name_th, name_en, category)
    values ('สื่อมวลชนคาทอลิกประเทศไทย', 'Thai Catholic Media', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'Q', 'Q26');

  insert into publishers (name_th, name_en, category)
    values ('สุขภาพใจ / บุ๊คไทม์', 'Book time', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G32');

  insert into publishers (name_th, name_en, category)
    values ('สุชิต หนังสือเก่า', 'Suchit Rare Books', array['โซนหนังสือเก่า'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J16');

  insert into publishers (name_th, name_en, category)
    values ('แสงเจริญ', 'Sangcharoen', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S12');

  insert into publishers (name_th, name_en, category)
    values ('แสงดาว', 'Saengdao', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'J', 'J31');

  insert into publishers (name_th, name_en, category)
    values ('แสงแดด', 'Sangdad Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O25');

  insert into publishers (name_th, name_en, category)
    values ('หรรษา', 'Hunsa-Book', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L25');

  insert into publishers (name_th, name_en, category)
    values ('ห้องเรียน', 'Class Publishing', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C20');

  insert into publishers (name_th, name_en, category)
    values ('ห้องสมุดดอตคอม', 'Hongsamutdotcom', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E36');

  insert into publishers (name_th, name_en, category)
    values ('ห้องสมุดยายพัน', 'Yaipan Library', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E31');

  insert into publishers (name_th, name_en, category)
    values ('หารค่าสำนักพิมพ์ X เฮอร์.', 'HANKA PUB x her.', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H41');

  insert into publishers (name_th, name_en, category)
    values ('อนิไทม์', 'Anitime', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P41');

  insert into publishers (name_th, name_en, category)
    values ('อนิเมท กรุ๊ป', 'Animate Group', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N02');

  insert into publishers (name_th, name_en, category)
    values ('อนิแม็กชอป (เอพลัสกับจีพลัส)', 'Animag-Shop (A-Plus&amp;G-Plus)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F08');

  insert into publishers (name_th, name_en, category)
    values ('อมรินทร์ บุ๊ค เซ็นเตอร์ (นายอินทร์)', 'Amarin Book Center (Naiin)', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G16');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B44');

  insert into publishers (name_th, name_en, category)
    values ('อ็อตเตอร์ซีน', 'otterzine', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P01');

  insert into publishers (name_th, name_en, category)
    values ('ออลเดย์ ช็อปปิ้ง', 'ALL DAY SHOPING', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D11');

  insert into publishers (name_th, name_en, category)
    values ('อะธิงบุ๊ค', 'A Thing Book', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K29');

  insert into publishers (name_th, name_en, category)
    values ('อะนิเมท เจเอ็มเอ', 'Animate JMA', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R01');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R36');

  insert into publishers (name_th, name_en, category)
    values ('อะโวคาโด บุ๊กส์', 'Avocado Books', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L08');

  insert into publishers (name_th, name_en, category)
    values ('อาทิตย์ละเล่ม บุ๊คส์ช็อป', 'ARTHIT Time Bookshop', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N07');

  insert into publishers (name_th, name_en, category)
    values ('อาเธน่า', 'Athena', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C30');

  insert into publishers (name_th, name_en, category)
    values ('อ่าน๑๐๑ สำนักพิมพ์', 'Reading101 Publishing', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D26');

  insert into publishers (name_th, name_en, category)
    values ('อ่านซิ — แพลตฟอร์มอีบุ๊กสำหรับเด็ก', 'Arnzi — Children’s E-Book Platform', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C18');

  insert into publishers (name_th, name_en, category)
    values ('อ่านบุ๊ค', 'Arnbook', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C37');

  insert into publishers (name_th, name_en, category)
    values ('อาหารสมอง', 'Arharm Samong', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S01');

  insert into publishers (name_th, name_en, category)
    values ('อิงค์ทรีบุ๊ค', 'Inktreebook', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D36');

  insert into publishers (name_th, name_en, category)
    values ('อินดิโก้ ออน บุ๊คแฟร์', 'Indygo on bookfair', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C32');

  insert into publishers (name_th, name_en, category)
    values ('อินโนเวตีฟ เอ็กเพอริเมนต์', 'Innovative Experiment (INEX)', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C04');

  insert into publishers (name_th, name_en, category)
    values ('อินส์พัล', 'Inspal / Life Balance / Dream&amp;Passion / The Law Group', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'C', 'C16');

  insert into publishers (name_th, name_en, category)
    values ('อีกา x ไมเนอร์ฟีลลิ่ง', 'EKA x minor feelings', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'K', 'K27');

  insert into publishers (name_th, name_en, category)
    values ('เอ็กซเปอร์เน็ท', 'Expernet', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'I', 'I07');

  insert into publishers (name_th, name_en, category)
    values ('เอเซีย บุ๊คส', 'Asiabooks', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'H', 'H31');

  insert into publishers (name_th, name_en, category)
    values ('เอ็นจอยบุ๊ค', 'ENJOYBOOK', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E39');

  insert into publishers (name_th, name_en, category)
    values ('เอ็นอีดี คอมิกส์', 'NED Comics', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M42');

  insert into publishers (name_th, name_en, category)
    values ('เอ-บุ๊ค ดิสทริบิวชั่น', 'A-Book Distribution', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O03');

  insert into publishers (name_th, name_en, category)
    values ('เอฟเค คอร์ปอเรชั่น', 'FK Corporation', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B25');

  insert into publishers (name_th, name_en, category)
    values ('เอ็มบุ๊คส์', 'MBOOKS', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G26');
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'S', 'S17');

  insert into publishers (name_th, name_en, category)
    values ('เอ็มไอเอส', 'MIS Publishing', array['โซนหนังสือเด็กและการศึกษา'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'D', 'D20');

  insert into publishers (name_th, name_en, category)
    values ('เอส พี เค จอย', 'SparkJoy', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B24');

  insert into publishers (name_th, name_en, category)
    values ('เอสเอ็มเอ็ม พลัส', 'SMM PLUS', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N50');

  insert into publishers (name_th, name_en, category)
    values ('แอนิเมเต้ย ช็อป', 'AnimaToey Watercolor', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M26');

  insert into publishers (name_th, name_en, category)
    values ('แอร์โรว์ มัลติมีเดีย', 'Arrow Multimedia', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M15');

  insert into publishers (name_th, name_en, category)
    values ('โอเคฟายน์', 'OK._____.FINE', array['โซน Non-book'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'R', 'R21');

  insert into publishers (name_th, name_en, category)
    values ('โอเคแอลเอส / สำนักพิมพ์ชวนอ่าน', 'OKLS / Chuan An Books', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'P', 'P29');

  insert into publishers (name_th, name_en, category)
    values ('โอเดียนสโตร์', 'Odeon Store', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'M', 'M07');

  insert into publishers (name_th, name_en, category)
    values ('โอเพ่นดูเรียน', 'OpenDurian', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'L', 'L33');

  insert into publishers (name_th, name_en, category)
    values ('โอเพ่นบุ๊คส์', 'openbooks', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'G', 'G08');

  insert into publishers (name_th, name_en, category)
    values ('ไอรา พับลิชชิ่ง', 'Ayra Publishing', array['โซนหนังสือ Boy''s Love / Girl''s Love'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'B', 'B39');

  insert into publishers (name_th, name_en, category)
    values ('ไอริส', 'Irisbook Publishing', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'N', 'N41');

  insert into publishers (name_th, name_en, category)
    values ('ฮัมมิ่งบุ๊คส์', 'Hummingbooks', array['โซนหนังสือนิยายและวรรณกรรม'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'F', 'F45');

  insert into publishers (name_th, name_en, category)
    values ('เฮอร์มิท', 'Hermit Books', array['โซนหนังสือการ์ตูนและวัยรุ่น'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'O', 'O32');

  insert into publishers (name_th, name_en, category)
    values ('แฮปปี้ไซเอนซ์', 'Happy Science', array['โซนหนังสือทั่วไป'])
    returning id into pub_id;
  insert into booths (publisher_id, zone, booth_number)
    values (pub_id, 'E', 'E30');

end $$;
