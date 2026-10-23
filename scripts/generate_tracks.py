import re
import json

raw_text = """1. Aaina Mon Bhanga | Zubeen Garg, Jeet Gannguli, & Priyo Chattopadhyay | ID: RFaUZWdczvk
2. Aaj Dil Shayarana | Pritam; Arijit Singh | ID: 8y3-kf7uPMQ
3. Aaj Se Teri | Arijit Singh | ID: 1E-ZSGWK6g0
4. Aamar Praan Jahaa Chaay | Arijit Singh; Rabindranath Tagore | ID: ikNJc-D8-RY
5. Aami Bono Phool Go | Kanan Devi; Shaan; Jeet Gannguli; Late Pranab Roy | ID: qTr9Fc-M6oM
6. Aami Sudhu Cheyechi Tomay | Mohammed Irfan | ID: PgX5BqFngXE
7. Aashona | Arijit Singh; Prashmita Paul; Arindom | ID: jZc7DGsZkY0
8. Akhiyaan Milavanga | Arijit Singh; Sruthy Sasidharan | ID: 2Wmnb_0C5sc
9. Amar Aguner Chhai | Raj Barman | ID: Ge1M-YQOvWw
10. Amar Mon (Original Motion Picture Soundtrack) | Mohammed Irfan | ID: ftu1VsnW2jQ
11. Amaro Porano Jaha Chay | Rishi Panda | ID: 1Y6DZ2MylRE
12. Atak Gaya - Arijit Singh | Arijit Singh; Rupali Moghe | ID: icbbdHwBJQQ
13. Aur Mohabbat Kitni Karoon | Arijit Singh | ID: 9FdcRExAIi8
14. Awaara Dil | Ki Kore Toke Bolbo | Ankush | Mimi | Ravi Kinagi | Latest Bengali Song | SVF | Arijit Singh | ID: azMLXbArheg
15. Baatein Ye Kabhi Na (Male) | Jeet Gannguli; Arijit Singh; Sayeed Quadri | ID: iKopExw_3Zg
16. Baaton Ko Teri | Arijit Singh | ID: 0uP0seKs5qA
17. Bangladesher Meye | Akassh | ID: lmHRx4HwXK8
18. Banjaara | Mohammed Irfan; Mithoon | ID: _eZnQzneuKs
19. Barbaad (Movie: Saiyaara) | Jubin Nautiyal; The Rish | ID: DRZHVrSmcWU
20. Bekhayali Mone | Shadaab Hashmi | ID: n7hXJrN4toE
21. Benche Theke Labh Ki Bol | Arijit Singh; Jeet Gannguli; Prasen | ID: K4dcOCzMq3o
22. Besh Korechi Prem Korechi | Shaan, Akriti Kakar, Jeet Gannguli, and Raja Chanda | ID: fmcSgzJxPSk
23. Bhalobashar Morshum (Male version) | Arijit Singh | ID: JdJU4UDsfWY
24. Bhalobashar Morshum (ভালবাসার মরশুম) | X=Prem | Arijit Singh | Sanai | Barish | Srijit | SVF | SVF | ID: f6-FZFqmZgI
25. Bhalobeshe Kono Bhool | Arindom , Shalmali Kholgade | ID: eo9zsj0FM3c
26. Bhalolaage Tomake | Arijit Singh , Anweshaa Dutta Gupta | ID: HmEdQxUSrSw
27. Bhojo Gourango (ORIGINAL) | Jeet Gannguli | ID: cSFiA5WVBfA
28. Bojhabo Ki Kore | Arijit Singh | ID: mywD3Y97glE
29. Bojhena Se Bojhena | Arijit Singh | ID: BogKRCHJLZg
30. Bol Do Na Zara | Armaan Malik | ID: 2Y3Wsdq-MN8
31. Bolo Na Tumi Amar | Jeet Gannguli; Monali Thakur; Gautam Sushmit | ID: jbHQSw8_uIY
32. Boroloker Bitilo | Satrujit Dasgupta ,Dev Sen | ID: BZhgj-ZgqDY
33. Brishti Bheja |Full Video Song |Aashiqui |Ankush |Nusraat Faria |Savvy |Shadaab Hashmi |Eskay Movies | Eskay Movies | ID: IiCjjVHD5hA
34. Bulbuli | Ritu Raj; Nandita | ID: MY1aZQPmd8I
35. Bum Chiki | Akriti Kakkar; Nakash Aziz | ID: 1koSBje19Es
36. Bum Chiki | Nakash Aziz; Akriti Kakkar | ID: 7uB8v41jbm8
37. Chaahat | Jeet Gannguli; Rahat Fateh Ali Khan; Sayeed Quadri | ID: lB2MdA1aVDc
38. Chal Wahan Jaate Hain | Arijit Singh | ID: HjKSkhqK4WE
39. Chand Sifarish | Shaan; Kailash Kher | ID: ZaURV4XxdPI
40. Chann (From "Udta Teer") | Amitabh Bhattacharya; Arijit Singh; Sachin-Jigar | ID: 7eKJFnvYfOE
41. Character Dheela | Pritam; Neeraj Shridhar; Amrita Kak; Amitabh Bhattacharya | ID: GvopEaPnMx8
42. Chaleya | Arijit Singh | ID: VAdGW7QDJiU
43. Chupi chupi mon (From "Love Story") | Raj Barman; ,; Prashmita Paul; Savvy | ID: 3QxkbWobmi0
44. Daddy (ORIGINAL) | Prasenjit Mallick , Biswajeeta Deb | ID: uPJ17d2AE0Y
45. Dance Ka Bhoot | Arijit Singh | ID: wuzTkiYJoNw
46. Dariye Acho Tumi Amar (Unplugged) | Raj Barman | ID: OVXmhVKquu4
47. DARKHAAST (feat. Sunidhi Chauhan & Arijit Singh) | Mithoon | ID: -3vUz7QPljM
48. Darling (ORIGINAL) | Madhuraa Bhattacharya , Prosenjit Chatterjee Mallick | ID: PJBhYMsGiOw
49. De Signal | Zubeen Garg; June Banerjee; Dev Sen | ID: JdZoVUHKqlw
50. Deewaana Deewaana | A.R. Rahman | ID: lnY-RsN1Hr0
51. Deewana | Prasenjit Mallick; Nilakshi Bhattacharya | ID: NmFYTCIQwho
52. Dekhechhi Rupshagore | Mahtim Shakib | ID: 6IBcLSKtaB4
53. Dekhte Dekhte (From "Batti Gul Meter Chalu") | Atif Aslam; Nusrat Fateh Ali Khan; Rochak Kohli | ID: JaNN2D54Dow
54. Desi Chhori | Neha Kakkar , Satrujit Dasgupta | ID: z83eQKVAcP0
55. Deva Deva (From "Brahmastra") | Amitabh Bhattacharya; Jonita Gandhi; Arijit Singh; Pritam | ID: WjAPDofGg28
56. Dhip Dhip Buker Majhe | Nakash Aziz | ID: fntdH4e-MBw
57. Dhitang Dhitang | Prasen; Armaan Malik; Jeet Gannguli | ID: j87D8QMNe5k
58. DIL DE DIYA HAI | Anand Raj Anand; SAMEER | ID: YmNNudulXlc
59. Dil Jhoom - Vishal Mishra (From "Gadar 2") | Arijit Singh | ID: BsqrmY91nUQ
60. Dooron Dooron | Paresh Pahuja; Shiv Tandan; Meghdeep Bose | ID: U_nAFr9tLYg
61. Du Jone Title | Jeet, June Banerjee | ID: SqayidWt314
62. Ebar Jeno Onno Rokom Pujo | Antara Mitra; Nakash Aziz | ID: E2zfQEo7Q_M
63. Eeche Joto | Arijit Singh; Monali Thakur | ID: rmcV-HRrL88
64. Ehsaas | Faheem Abdullah; Duha Shah; Vaibhav Pani; Hyder Dar | ID: 8gq3S53aH3Y
65. Ei Aashiqui | Akriti Kakkar; Mohammed Irfan | ID: P3vgptcoU4Q
66. Eksho Vrindavan | Haripada Bandwala | Ankush | Nusrat | Payel Dev | Latest Bengali Song | SVF | SVF | ID: kmaRdH-BbHA
67. Ekta Premer Gaan Likhechi | Jeet Gannguli; Prasen | ID: k7eCTdz1YQY
68. Eshechi Toke Niye | Mohit Chauhan; Jeet Gannguli; Prasen | ID: tx8WWwTPCCo
69. Eta Ki Bhul | Shaan; Monali Thakur | ID: Ajw1xsCMV6E
70. Fakira | Arijit Singh; Sanam Puri; Neeti Mohan | ID: tbrcMC1k1i8
71. Gaane Gaane (From "Dhumketu") | Arijit Singh; Shreya Ghoshal; Anupam Roy | ID: e-BUE_yd4jQ
72. Gehra Hua (From "Dhurandhar") | Shashwat Sachdev; Arijit Singh; Armaan Khan; Irshad Kamil | ID: i1o1p_DD6TU
73. Gerua | Pritam; Arijit Singh; Antara Mitra | ID: reBEkYrqMhA
74. Gulabi Aankhen | Sanam | ID: 39fdxGmYfvg
75. Gunaah | Jeet Gannguli; Mustafa Zahid; Sayeed Quadri | ID: mCnX3_Xz5G4
76. Haan Main Galat (From "Love Aaj Kal") | Pritam; Arijit Singh; Shashwat Singh | ID: aG2PQ8x9F4g
77. Habudubu Habudubu | Akriti Kakkar; Jeet Gannguli; Zubeen Garg | ID: wV2PMtnLTkc
78. HAR KISI KO | ARIJEET SINGH,NEETI MOHAN, CHIRRANTAN BHATT, KALYANJI-ANANDJI, and MANOJ YADAV | ID: DTOshzP5BEQ
79. HARE KRISHNA | Fakira | ID: iu2mgYgOGgc
80. Haule Haule | Sukhwinder Singh | ID: gLBoyzFnAdE
81. Hawayein (From "Jab Harry Met Sejal") | Pritam; Arijit Singh | ID: ii9KLQoV78I
82. Hobe Re Hoichoi - Nakash Aziz Version | Nakash Aziz | ID: VKa3-xB4XT4
83. Hookah Bar (From "Khiladi 786") | Himesh Reshammiya; Vineet Singh; Aman Trikha | ID: rCwnaOQJoms
84. Hori Din To Galo | Jubeen | ID: Q1iEiOk6Bjw
85. Hua Hain Aaj Pehli Baar (feat. Armaan Malik & Palak Muchhal) | Amaal Mallik | ID: Gg3Xz89Q2UU
86. Humdard | Arijit Singh; Mithoon | ID: Z_Pr3Z9jz8I
87. IJAZAT | MEET BROS; Arijit Singh | ID: qI4rijn4_Mo
88. Ijazzat Hai | Raj Barman; ,; Sachin Gupta; Kumaar | ID: lCnURG36kYs
89. Ik Vaari Aa (From "Raabta") | Arijit Singh | ID: vL14wk2cj6U
90. Ilahi | Arijit Singh | ID: fdubeMFwuGs
91. Ishq (From "Lost;Found") | Faheem Abdullah; Rauhan Malik; Amir Ameer | ID: f419vqAt8PU
92. ISHQ MUBARAK | Arijit Singh; Ankit Tiwari | ID: LmMzgIvIJCE
93. Isq Risk | Rahat Fateh Ali Khan | ID: -qsXaVlp0eI
94. Itni Si Baat Hain | Arijit Singh; Antara Mitra | ID: MzKvcV0Re7U
95. Ja Hobe Dekha Jabe | Shaan ,Mahalakshmi Iyer | ID: szCOmzgPQKw
96. JAB TAK (REDUX) | Armaan Malik; Amaal Mallik | ID: dZM5gZwXw4U
97. Jai Jai Ram | Shreya Ghoshal; Arijit Singh | ID: yWNPxS0sXnE
98. Janina | Nachiketa Chakraborty | ID: 7qs1LeHTo38
99. Jane Mon | Jeet Gannguli; Prasen | ID: ezueAc4Vz48
100. Janam Janam | Pritam; Arijit Singh; Antara Mitra | ID: 5rHzi_5rSyw
101. Jante Jodi Chao (From "Rokto") | Mohammed Irfan | ID: m_8lcpmN1tI
102. Jeena De Na | Harish Sagane; Raj Barman | ID: kZoTnY0ZagQ
103. Jeena Jeena | Sachin-Jigar; Atif Aslam | ID: AsLPGPs5iQk
104. Jeene Laga Hoon | Atif Aslam; Shreya Ghoshal | ID: 3M3o3Ak1qBY
105. Jhinkunakur Na | Rana Mazumder; Akriti Kakkar | ID: iGZ4B8YlgsM
106. Jhoome Jo Pathaan (From "Pathaan") | Arijit Singh; Arijit Singh; Sukriti Kakkar; Vishal Dadlani | ID: YxWlaYCA8MU
107. Jiya Tui Chara (From "Biye Bibhrat") | Arijit Singh; Ranajoy Bhattacharjee | ID: h4mn9jPCOJw
108. Jo Tere Sang | Jeet Gannguli; Mustafa Zahid; Sayeed Quadri | ID: GeWnEyQRCUs
109. Jodi Raji Hosh | Raj Barman | ID: wQblMo1sJzA
110. Jugraafiya (feat. Hrithik Roshan & Mrunal Thakur) | Udit Narayan; Shreya Ghoshal | ID: X8bu-nEmN5o
111. Kaabil Hoon (From "Kaabil") | Palak Muchhal | ID: O65JHeSDhuc
112. KABHI JO BAADAL BARSE | ARIJIT SINGH, SHARIB-TOSHI, TURAZ, and AZEEM SHIRAZI | ID: qH1eRWlJpsY
113. Kabira | Amitabh Bhattacharya | ID: MuCfsZk9lbU
114. Ke Tui Bol | Arijit Singh; Jeet Gannguli; Prasen | ID: Ujnl1Wm71Wo
115. Keno Aaj Kal | Nachiketa Chakraborty | ID: ap48_HZpXUo
116. Keno Je Toke | Raj Barman | ID: FDqRap7PpH4
117. Keu Jaane Naa | Arijit Singh | ID: -gztlYsjRUg
118. Khairiyat | Pritam; Arijit Singh; Amitabh Bhattacharya | ID: 1U9548B35WI
119. Khat | Navjot Ahuja | ID: KrJ5c-Egz-U
120. Khawne Gorachand, Khawne Kaalaa | Arijit Singh | ID: guv_YlxJIHo
121. Kheech Meri Photo | Himesh Reshammiya; Neeti Mohan; AKASA; Darshan Raval | ID: wnYldJ2MJxU
122. Kholakhuli Bolte Gele | Raj Barman; Anwesshaa Dutta Gupta | ID: IbpZxmR-844
123. Khuda Bhi | Mohit Chauhan | ID: ppcVqfsekIs
124. Khuda Jane | Zubeen Garg, Shyam Bhatt, Shreya Ghoshal, and Jeet Gannguli | ID: GxogD-tbB70
125. Khunjechi Tokey Raat Berate (ORIGINAL) | Jeet Gannguli | ID: fGr-lOrvWgU
126. Ki Kore Toke Bolbo | Arijit Singh; Jeet Gannguli; Prasen | ID: CMB_YVUiR1I
127. Kichhu Kichhu Kotha | Arijit Singh | ID: LBY0KVTX430
128. Kono Rupkothar Deshe: Lyrical | Arijit Singh | Bojhena Se Bojhena (TV Series) | Kalyaniyans | ID: 2fPrA6PbiPE
129. Kotobaar Bojhabo Bol | Mohammed Irfan | ID: zEUtnec0Jm4
130. Laal Ishq | Sanjay Leela Bhansali; Arijit Singh | ID: GEH3Aev0uME
131. Lady Killer Romeo (ORIGINAL) | Jeet Gannguli | ID: eoLZVAk9t_U
132. Le Halua Le (ORIGINAL) | Bappi Lahiri , Priyanka Vaidya | ID: JPH8eTjKFxo
133. Likhe Jo Khat Tujhe | Raj Barman | ID: -bf-K1l144I
134. LO MAAN LIYA | Arijit Singh; Jeet Gannguli | ID: Gef1KePPRoI
135. Long Distance Love | Coke Studio Bangla | Ankan Kumar; Modernotaku; Shuvendu Das Shuvo | ID: xQ2Dz9K9xeg
136. Loveria | Samidh Mukherjee | ID: if5SLCRQr7Y
137. Love Me (ORIGINAL) | Vicky A Khan | ID: 0CN73wWv3Sc
138. Love Me (ORIGINAL) | Vicky A Khan | ID: ltGCEgzCg1o
139. Love Me Thoda Aur | Pritam; Arijit Singh; Irshad Kamil | ID: Vf5eUm0Jvz8
140. Love U Love U O My Paglu Title Track | Mika Singh; Shreya Ghoshal; Jeet Gannguli | ID: r0xKUoGmulY
141. Love You Soniyo | Zubeen Garg; Jeet Gannguli; Raja Chanda | ID: -Bib8gTPEFQ
142. Lukochuri | Nakash Aziz | ID: nEaEMOxNvTI
143. Lutt Putt Gaya | Pritam | ID: 9Z79T_o4v8c
144. Main Agar Kahoon | Arijit Singh; Sonu Nigam; Shreya Ghoshal | ID: 8PEqEh1lnNE
145. Main Awara (ORIGINAL) | Prasenjit Mallick ,Megha Bhardwaj | ID: COCJILMEYDM
146. Main Dhoondne Ko Zamaane Mein | Arijit Singh | ID: FQyKzz3NFcc
147. Main Tera Boyfriend (From "Raabta") | Arijit Singh; Neha Kakkar; MEET BROS | ID: EaJV10DCnEM
148. Majhe Majhe Tobo | Arindom | ID: t-WY9dBpZTo
149. Mala Re (ORIGINAL) | Jeet Gannguli | ID: G2tTYmSzR6U
150. Manjha (From "Middle Class Love") | Himesh Reshammiya; Raj Barman | ID: h1DjBPjpAgg
151. Mareez - E - Ishq | Sharib Toshi; Arijit Singh | ID: T6jFshH6XmY
152. Masha Allah (Original Motion Picture Soundtrack) | Akriti Kakkar; Dev Negi | ID: rkgVeQeGH6M
153. MAST MAGAN | Arijit Singh; CHINMAYI SRIPADA; SHANKAR-EHSAAN-LOY; Amitabh Bhattacharya | ID: InD68CDGT9Q
154. Maya | Helal | ID: Ee2LaM9638w
155. Mere Naam Tu (From "Zero") | Abhay Jodhpurkar; Ajay-Atul | ID: TbjbZFqLEtw
156. Mere Rashke Qamar (From "Baadshaho") | Nusrat Fateh Ali Khan; Rahat Fateh Ali Khan | ID: iyxByIhwrC0
157. Meyeder Mon Bojha | Ankush | Nusraat Faria | Savvy | Aashiqui Bengali Movie 2015 | Eskay Movies | Eskay Movies | ID: Z6dItJxC3gk
158. Mon (ORIGINAL) | Jeet Gannguli | ID: 6HkLos7j-vc
159. Mon Bajare (From "Abar Bibaho Obhijaan") | Nakash Aziz; Jeet Gannguli | ID: YdEqesFBiR4
160. Mon Bojhe Naa | Arijit Singh | ID: _So6RTIifnU
161. Mon Hariye Beghorey (ORIGINAL) | Mohit Chauhan | ID: -7ZRoPiqWGg
162. Mon Majhi Re | Arijit Singh | ID: ldfeUnod0tw
163. Mon Toke Dilam (ORIGINAL) | Zubeen Garg | ID: H5yB4TKTb3c
164. Moner Kinara (Original Motion Picture Soundtrack) | Raj Barman | ID: Z1cz6kmX-Jg
165. Moner Manush | Anupam Roy; Satyaki Banerjee; Babul Supriyo | ID: 3DZURGLGpXU
166. Moner Radio (ORIGINAL) | Shilpa Rao ,Jeet Gannguli | ID: veJbuhWR7hM
167. Monta Katha Sonena (From "Kidnap") | Goldie Sohel; Palak Muchhal; Jeet Gannguli | ID: ME5ZCjYzesk
168. Muskurane (Romantic) | Arijit Singh | ID: HQ4Ox7mLqds
169. Naam Na Jana Pakhi (Duet Version) | Arijit Singh; Shreya Ghoshal | ID: LB25yx2mIUw
170. Noor Hi Noor | Raj Barman | ID: wZLTAGXfMcs
171. O Madhu | Benny Dayal | ID: AubPSTJLf5g
172. O Meri Laila | Atif Aslam | ID: ThPinA3THas
173. O Piya Re Piya (ও পিয়া রে পিয়া) | Majnu | Hiraan | Srabanti | Arijit Singh | Savvy | Rajib | SVF | SVF | ID: K6e4p0vfxSw
174. Oboseshe | Arijit Singh | ID: koJ1JjAw_jc
175. Oh Shona Miss You | Gopika Goswami; Prasenjit Mallick; Bob Stephens | ID: zCFZWJQ2nps
176. Ore Manwa Re | Arijit Singh; Akriti Kakkar | ID: 7pilZn2EfBI
177. Ore Mon Udashi | Arijit Singh | ID: OGj3b6Gw1tI
178. Ovhiman | Tanveer Evan | ID: SEPEpvLQVrY
179. Pachtaoge (From "Jaani Ve") | Arijit Singh; B Praak | ID: _p-LyTrNWT8
180. Paglu | Mika Singh; Akriti Kakar; Jeet Gannguli; Priyo Chattapadhyay | ID: 3Zg4MB_75iQ
181. Pagol Ami Already | Zubeen Garg, Mahalaxmi Iyer | ID: XW7EnNANYYE
182. PALAT - TERA HERO IDHAR HAI | Arijit Singh; SAJID-WAJID; KAUSAR MUNIR; DANISH SABRI | ID: t9o22bt6VU0
183. Parbona Ami Charte Toke | Arijit Singh | ID: 7m8Ww5Tvdw8
184. Party Shoes | Shadaab Hashmi , Neha Kakkar | ID: 8_wtUxoWvgs
185. Patar Bashori | Coke Studio Bangla | Ishaan; Sunidhi Nayak; Adit Rahman | ID: 2QehhigExbo
186. Pehli Nazar Mein | Atif Aslam | ID: BadBAMnPX0I
187. Phir Kabhi | Arijit Singh; Amaal Mallik | ID: HwJsSAT6wBg
188. Phir Mohabbat | Mohammed Irfan; Arijit Singh; Saim Bhat | ID: 12KGtUu4xhg
189. Phool Koli (ORIGINAL) | Dev Sen; Prasenjit Mallick | ID: bFLlRGESp00
190. Police Chorer Preme Porechhe (ORIGINAL) | Abhijeet ,Akriti Kakar | ID: x5rRJWT86vI
191. Porle Mone (ORIGINAL) | Jeet Gannguli | ID: bXVH8sKo1nI
192. Prem Ki Bujhini | Zubeen Garg, Akriti Kakar, Jeet Gannguli, and Prasen | ID: hdwSVWrjqGw
193. Pungi | Pritam; ,; Mika Singh; Amitabh Bhattacharya; Nakash Aziz | ID: n2zES3M4uwo
194. Pyar Ka Bukhaar | Suraj Jagan; Jeet Gannguli | ID: g1QIbIcXP2s
195. Pyar Ka Jhatka | Mika, Mamta Sharma | ID: 1mCRpwnoJEI
196. Qaafirana | Arijit Singh; Nikhita Gandhi | ID: Kf781IbMQXk
197. Qayde Se | Arijit Singh | ID: Z25GNhpajyY
198. Raabta | Pritam; Arijit Singh; Amitabh Bhattacharya | ID: piUHBTXsoiY
199. Raabta (Siyaah Raatein) | Pritam; Arijit Singh; Hamsika; Joi | ID: tbXNVm8CXxg
200. Raabta (Title Track) | Arijit Singh; Nikhita Gandhi | ID: v4421pPhCdI
201. RAAZ AANKHEIN TERI | Arijit Singh; Jeet Gannguli | ID: 9kTlI-9o84Q
202. Raaji Achi | Raj Barman | ID: i10twClMCzQ
203. Ram Ji Aake Bhala Karenge (From "Bhooth Bangla") | Pritam, Armaan Malik, Aarvan, Kumaar, and Mellow D | ID: OeIyH6QIe5U
204. Remix Qawwali | Neha Kakkar; Nakash Aziz | ID: 7YKjr4U-hWM
205. Rishte Naate | Rahat Fateh Ali Khan, Sayeed Qadri, & Pritam | ID: c504EGCwQlU
206. Sahiba | Aditya Rikhari | ID: tNc2coVC2aw
207. Sajni | Arijit Singh | ID: k3g_WjLCsXM
208. Samjhawan | Jawad Ahmed; Sharib Toshi; Arijit Singh; Shreya Ghoshal | ID: pUwpLoLlzNQ
209. Sanam Re | Mithoon | ID: 1vVGjAonhEA
210. Sanam Teri Kasam | Himesh Reshammiya; Ankit Tiwari; Palak Muchhal | ID: KT6S5PleERk
211. Saree Ke Fall Sa | Pritam; Antara Mitra; Nakash Aziz; Mayur Puri | ID: dct0tpvgOsw
212. SATRANGA | Arijit Singh | ID: HrnrqYxYrbk
213. SAWAN AAYA HAI | Arijit Singh; TONY KAKKAR | ID: LTl0QBlqvBA
214. Selfie | Nakash Aziz; Jolly das | ID: SXbzlLusL_4
215. Shayad (From "Love Aaj Kal") | Arijit Singh | ID: MJyKN-8UncM
216. Shona | Antara Mitra; Nakash Aziz | ID: hvDfpaGXMFs
217. Shundori Komola | Jeet Gannguli | ID: l83G59ii1Nk
218. Sitaare (From "Ikkis") | Arijit Singh; White Noise Collectives; Amitabh Bhattacharya | ID: uT_HXrrmHX8
219. Soch Na Sake | Arijit Singh | ID: MRtRcTfszjY
220. Sohniye Tu | Zubeen Garg, June Bannerjee | ID: KmBhASCsrbM
221. Solid Case Kheyechi | Bappi Lahiri, Poornima Deshmukh | ID: 3EnXb9JPLwQ
222. Subha Hone Na De | Pritam; Mika Singh; Shefali Alvares; Kumaar | ID: _wMsvhz8YSk
223. Take It Easy Lyrical | Ami Je Ke Tomar | Ankush-Sayantika | Indraadip | Payel | Soumalya | SVF Music | SVF Music | ID: _t3po2oQ5zc
224. Tenu Sang Rakhna - Jigra | Alia Bhatt | Vedang Raina | Arijit Singh | Achint, Anumita | Varun | Achint; Varun Grover; Anumita Nadesan; Arijit Singh | ID: OkpIoEC44kk
225. Tenu Sang Rakhna - Vocals Only | Achint; Arijit Singh; Anumita Nadesan | ID: RbQM51AsPEc
226. Tera Chehra | Himesh Reshammiya; Arijit Singh | ID: VMmLBjcEXrM
227. Tera Fitoor | Arijit Singh | ID: laDxzq2qEmI
228. Tere Bin | Rahat Fateh Ali Khan | ID: hejXc_FSYb8
229. Tere Hawaale | Pritam; Arijit Singh; Shilpa Rao; Amitabh Bhattacharya | ID: Z0VbANbyH2o
230. Tere Ishk Mein | Arijit Singh | ID: 2gWbNcgZFM0
231. Tere Liye | Atif Aslam; Shreya Ghoshal; Sachin Gupta | ID: 5U5Ru0nTiUM
232. Tere Pyaar Mein | Arijit Singh | ID: zBlklssMFEo
233. Tere Sang Ishq Hua | Arijit Singh | ID: bFvzAzqhhYc
234. Tere Sang Yaara | Manoj Muntashir | ID: 5gwy0gcjIkI
235. Teri Meri Kahaani | Arijit Singh; Palak Muchhal | ID: TiP72S9tf7o
236. Teri Saanson Mein (From "Karle Pyaar Karle") | Arijit Singh; Palak Muchhal | ID: lB1bKOxvmvA
237. Thik Emon Ebhabe | Arijit Singh | ID: hjaAeQ2k7FM
238. Title Track (Full Song) | Romeo vs Juliet | Ankush | Mahiya Mahi | Akassh | Jaaz Multimedia | ID: 1-6zZ6-R49g
239. Toke Hebbi Lagche | Zubeen | ID: AW40LKm1TgI
240. Tomar Amar Prem | Zubeen Garg | ID: fSTPtRJOUbk
241. Tomay Hrid Majhare Rakhbo | Mahtim Shakib | ID: UMLtkClmX3o
242. Tor Ek Kothay | Arijit Singh | ID: tvoweqsfDJQ
243. Tor Ek Kothay | Arijit Singh | ID: ZZUohusRJd4
244. Tore Niya | Zubeen Garg, Mahalaxmi Iyer | ID: mpvzfqAXWl4
245. Tose Naina | Arijit Singh | ID: tk1nt6LXRCk
246. Tu Hain Toh Main Hoon (From "Sky Force") | Tanishk Bagchi; Arijit Singh; Afsana Khan; Irshad Kamil | ID: oyr9_tu_F2U
247. Tu Hi Disda (From "Bhooth Bangla") | Pritam, Arijit Singh, Nikhita Gandhi, and Kumaar | ID: 4FYKJPe0dOE
248. Tu Hi Hai Aashiqui | Arijit Singh | ID: 39fdgPzifLk
249. Tu Mile Dil Khile | Raj Barman | ID: xK-t0SX_-BE
250. Tu Milta Hai Mujhe | Raj Barman; Rashid Khan | ID: ptLNfe7-hiw
251. Tui Amar Hero | Mika Singh | ID: oW2JpFGaGpE
252. Tui Borsha Bikeler Dheu | Shaan; Palak Muchhal; Jeet Gannguli; Prasen | ID: jLK0IyCO-QY
253. Tujh Mein Rab Dikhta Hai | Roop Kumar Rathod | ID: 3E1NLVzDZ_Y
254. Tujhe Kitna Chahne Lage (From “Kabir Singh”) | Arijit Singh | ID: AgX2II9si7w
255. Tum Hi Ho | Arijit Singh | ID: fsiPzT50ZiM
256. Tum Pe Hum Toh | Raj Barman; Laado Suwalka | ID: 2g6blkfc_4I
257. Tum Prem Ho (Reprise) | Mohit Lalwani; Bharat Kamal | ID: mCsoAPRI52U
258. Tum Se | Varun Jain; Raghav Chaitanya; Sachin-Jigar | ID: mmkaDi06C2w
259. Tumhare Hi Rahenge Hum (From "Stree 2") | Sachin-Jigar; Varun Jain; Amitabh Bhattacharya; Shilpa Rao | ID: EV5982RVl6w
260. Tumi Aashe Paashe | Monali Thakur; Nakash Aziz | ID: bnFiJ_e_dEg
261. Tumi Jantei Paro Naa (From "Cheeni 2") | Mahtim Shakib; Mainak Mazoomdar | ID: jkYNIupznqc
262. Tumse Bhi Zyada | Pritam; Arijit Singh; Irshad Kamil; Ashish Pandit | ID: CbfaLIvSvgc
263. TUSE MILKE DIL KA HAI JO HAAL | Sonu Nigam; AFTAB SABRI; HASHIM SABRI; ANU MALIK | ID: xteZNX3B4yA
264. Ureche Mon (original motion picture soundtrack) | Arijit Singh | ID: rqEyZqHflU0
265. Uska Hi Banana | Arijit Singh | ID: hmsebjbRb1k
266. Ve Maahi | Arijit Singh; Asees Kaur | ID: CqS9O-6ok64
267. WAJAH TUM HO | Mithoon | ID: Y-Vgaz7SbWs
268. What Jhumka? | Arijit Singh | ID: 87JIOAX3njM
269. Yeh Awarapan (Vocals Only) | Amaal Mallik; Arijit Singh; Rashmi Virag | ID: kI1WSZppu4w
270. Zaalima | Arijit Singh; Harshdeep Kaur | ID: eXkHvT--DBU
271. Zihaal e Miskin | Javed - Mohsin; Vishal Mishra; Shreya Ghoshal | ID: 11OWuPcElJw"""

lines = raw_text.strip().split('\n')
tracks = []

for line in lines:
    line = line.strip()
    if not line:
        continue
    # Format: N. Title | Artists | ID: videoId
    match = re.match(r'^\d+\.\s*(.+?)\s*\|\s*(.+?)\s*\|\s*ID:\s*([a-zA-Z0-9_-]+)', line)
    if match:
        title = match.group(1).strip()
        artist = match.group(2).strip()
        vid = match.group(3).strip()
    else:
        # Fallback split
        parts = line.split('|')
        if len(parts) >= 3:
            title_part = parts[0].strip()
            title = re.sub(r'^\d+\.\s*', '', title_part).strip()
            artist = parts[1].strip()
            id_part = parts[-1].strip()
            vid_match = re.search(r'([a-zA-Z0-9_-]{11})', id_part)
            vid = vid_match.group(1) if vid_match else id_part.replace('ID:', '').strip()
        else:
            continue

    # Determine intelligent category
    cat = 'bengali'
    tl = (title + " " + artist).lower()
    if any(k in tl for k in ['rabindranath', 'bangla', 'bengali', 'mon', 'toke', 'bhalobasha', 'tor', 'tumi', 'amar', 'pujo', 'jeev', 'paglu', 'nachiketa', 'bhojo', 'baul', 'folk']):
        cat = 'bengali'
    elif any(k in tl for k in ['arijit', 'pritam', 'shreya', 'atif', 'mithoon', 'armaan', 'jubin', 'sonu', 'kailash']):
        cat = 'trending'
    elif any(k in tl for k in ['lofi', 'chill', 'relax']):
        cat = 'lofi'
    elif any(k in tl for k in ['remix', 'dance', 'hookah', 'party', 'pungi']):
        cat = 'edm'
    else:
        cat = 'pop'

    track = {
        "id": vid,
        "title": title,
        "artist": artist,
        "thumbnail": f"https://img.youtube.com/vi/{vid}/hqdefault.jpg",
        "duration": 220,
        "durationFormatted": "3:40",
        "youtubeUrl": f"https://www.youtube.com/watch?v={vid}",
        "isCurated": True,
        "addedBy": "SUBHA MASTER ADMIN",
        "addedAt": 1729680000000,
        "category": cat,
        "audioQuality": "ultra_hd",
        "isOfflineCached": True
    }
    tracks.append(track)

print(f"Total parsed tracks: {len(tracks)}")

# Curated playlists featuring these songs
playlists = [
    {
        "id": "arijit-singh-master-picks",
        "title": "Arijit Singh Master Collection",
        "description": "The definitive collection of soul-stirring hits, romantic anthems, and timeless melodies by Arijit Singh.",
        "coverImage": f"https://img.youtube.com/vi/{tracks[1]['id']}/hqdefault.jpg",
        "trackIds": [t["id"] for t in tracks if "Arijit Singh" in t["artist"]][:20],
        "createdBy": "subha-admin",
        "createdByName": "Subha Master Admin",
        "isOfficial": True,
        "isPublic": True,
        "updatedAt": 1729680000000,
        "syncedOffline": True
    },
    {
        "id": "bengali-romantic-classics",
        "title": "Bangla Modern & Romantic Hits",
        "description": "Handpicked Bengali romantic melodies by Jeet Gannguli, Zubeen Garg, Shaan, and Mohammed Irfan.",
        "coverImage": f"https://img.youtube.com/vi/{tracks[0]['id']}/hqdefault.jpg",
        "trackIds": [t["id"] for t in tracks if t["category"] == "bengali"][:20],
        "createdBy": "subha-admin",
        "createdByName": "Subha Master Admin",
        "isOfficial": True,
        "isPublic": True,
        "updatedAt": 1729680000000,
        "syncedOffline": True
    },
    {
        "id": "subha-high-energy-party",
        "title": "Subha High-Energy & Party Bangers",
        "description": "Upbeat party anthems, dance beats, and high-tempo club tracks for unstoppable energy.",
        "coverImage": f"https://img.youtube.com/vi/{tracks[40]['id']}/hqdefault.jpg",
        "trackIds": [t["id"] for t in tracks if any(k in (t['title'] + t['artist']).lower() for k in ['dance', 'party', 'hookah', 'paglu', 'pungi', 'chhori', 'desi'])][:15],
        "createdBy": "subha-admin",
        "createdByName": "Subha Master Admin",
        "isOfficial": True,
        "isPublic": True,
        "updatedAt": 1729680000000,
        "syncedOffline": True
    },
    {
        "id": "raj-barman-acoustic-covers",
        "title": "Raj Barman Acoustic & Unplugged",
        "description": "Mellifluous acoustic unplugged renditions and soulful covers by Raj Barman.",
        "coverImage": f"https://img.youtube.com/vi/{tracks[8]['id']}/hqdefault.jpg",
        "trackIds": [t["id"] for t in tracks if "Raj Barman" in t["artist"]][:15],
        "createdBy": "subha-admin",
        "createdByName": "Subha Master Admin",
        "isOfficial": True,
        "isPublic": True,
        "updatedAt": 1729680000000,
        "syncedOffline": True
    }
]

# Write to defaultTracks.ts
ts_content = f"""import {{ Track, Playlist }} from '../types';

export const DEFAULT_TRACKS: Track[] = {json.dumps(tracks, indent=2)};

export const DEFAULT_PLAYLISTS: Playlist[] = {json.dumps(playlists, indent=2)};
"""

with open('src/data/defaultTracks.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Successfully written to /src/data/defaultTracks.ts")
