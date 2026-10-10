/* =========================================================================
   Writing Mockups · Task 1 (Academic): 20 tasks with Band 8 model answers.
   All chart data is invented practice data. Every figure quoted in a model
   answer is checked against its chart by tools/check-mockups.js.
   ========================================================================= */
window.MOCKUPS_T1 = [
  /* ---------------------------------------------------- Energy & environment */
  {
    id: "t1-01", topic: "Energy & environment", visual: "line", title: "Electricity use per person in four countries",
    prompt: "The graph below shows average electricity consumption per person in four countries between 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "line", title: "Electricity consumption per person (thousand kWh per year)", x: [1990, 2000, 2010, 2020], series: [["Norland", [12, 14, 15, 13]], ["Esteria", [6, 7, 8.5, 10]], ["Kanto", [7, 7, 7.5, 7]], ["Vanda", [1, 2, 4, 6.5]]], max: 16, step: 4 },
    model: [
      "The line graph compares average electricity consumption per person in four countries between 1990 and 2020.",
      "Overall, people in Norland used far more electricity than those in the other three countries throughout the period, although Norland's figure fell in the final decade. Consumption grew most rapidly in Vanda, while in Kanto it remained almost unchanged.",
      "In 1990, the average person in Norland used 12,000 kWh, twice as much as in Esteria (6,000 kWh) and considerably more than in Kanto (7,000 kWh). Norland's figure rose to a peak of 15,000 kWh in 2010, before dropping to 13,000 kWh by 2020. Consumption in Kanto, by contrast, stayed at around 7,000 kWh for the whole period.",
      "The most dramatic change was in Vanda, where consumption per person was only 1,000 kWh in 1990. It doubled over the following decade and continued to climb, reaching 6,500 kWh in 2020, more than six times its original level. Esteria also saw steady growth, overtaking Kanto after 2000 and ending the period at 10,000 kWh.",
    ],
    notes: ["The overview gives the two big stories (Norland highest; Vanda fastest growth) without any numbers.", "Countries are grouped by pattern, not described one by one in order.", "Units are handled correctly: the axis shows thousands, so 12 becomes 12,000 kWh."],
    language: ["rose to a peak of", "stayed at around", "more than six times its original level", "overtaking", "by contrast"],
  },
  {
    id: "t1-02", topic: "Energy & environment", visual: "bar", title: "Household recycling by material",
    prompt: "The chart below shows the percentage of household waste recycled in one country in 2010 and 2020, by type of material. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "bar", title: "Household waste recycled (%)", x: ["Paper", "Glass", "Plastic", "Metal", "Food"], series: [["2010", [55, 48, 12, 30, 5]], ["2020", [70, 66, 28, 51, 34]]], max: 80, step: 20 },
    model: [
      "The bar chart shows the proportion of household waste that was recycled in one country in 2010 and 2020, broken down into five types of material.",
      "Overall, recycling rates rose for every material over the decade. Paper and glass were recycled the most in both years, while food waste saw the most striking improvement.",
      "In 2010, just over half of all paper (55%) was recycled, along with almost half of all glass (48%). By 2020, these figures had risen to 70% and 66% respectively, so glass had almost caught up with paper. Metal also performed well, with its recycling rate increasing from 30% to just over half (51%).",
      "The lowest figures were for plastic and food. Only 12% of plastic was recycled in 2010, and although this more than doubled to 28%, it remained well below the rates for paper, glass and metal. The most dramatic change was in food waste: the proportion recycled jumped from a mere 5% to 34%, an almost sevenfold increase, which meant that food overtook plastic by the end of the period.",
    ],
    notes: ["Every figure is attached to a comparison or a change.", "Materials are grouped into the high performers and the low performers.", "Precise approximation: “just over half”, “almost half”, “an almost sevenfold increase”."],
    language: ["broken down into", "respectively", "had almost caught up with", "more than doubled", "jumped from a mere … to"],
  },
  /* ---------------------------------------------------- Transport */
  {
    id: "t1-03", topic: "Transport", visual: "pie", title: "How commuters travel to work",
    prompt: "The pie charts below show how people in the town of Westbury travelled to work in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "pie", title: "Main way of travelling to work, Westbury (%)", pies: [{ label: "2000", slices: [["Car", 58], ["Bus", 18], ["Train", 9], ["Bicycle", 5], ["Walking", 10]] }, { label: "2020", slices: [["Car", 39], ["Bus", 16], ["Train", 17], ["Bicycle", 18], ["Walking", 10]] }] },
    model: [
      "The pie charts compare the ways in which people in the town of Westbury travelled to work in 2000 and 2020, divided into five methods of transport.",
      "Overall, the car remained the most common way of commuting, but its share fell considerably, while cycling and train travel became much more popular.",
      "In 2000, well over half of all commuters (58%) drove to work, compared with fewer than one in five who took the bus (18%). Walking accounted for 10% of journeys, while the train and the bicycle were the least common options, at 9% and 5% respectively.",
      "Twenty years later, the proportion of people driving had dropped to 39%. The biggest change was in cycling, whose share more than tripled to 18%, overtaking the bus, which declined slightly to 16%. The share of commuters travelling by train also almost doubled, from 9% to 17%. By contrast, the percentage of people walking to work stayed exactly the same, at 10%.",
    ],
    notes: ["The overview states both the main constant (the car stays first) and the main change.", "Fractions add variety: “well over half”, “fewer than one in five”.", "The second paragraph is organised by size of change, not by the order of the slices."],
    language: ["accounted for", "fewer than one in five", "more than tripled", "overtaking", "stayed exactly the same"],
  },
  {
    id: "t1-04", topic: "Transport", visual: "table", title: "Commuting in five cities",
    prompt: "The table below gives information about commuting in five cities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "table", title: "Commuting in five cities", head: ["City", "Average one-way journey (minutes)", "Average monthly cost (US$)", "Journeys by public transport (%)"], rows: [["Arlon", "52", "85", "64"], ["Brisa", "38", "120", "41"], ["Corvo", "25", "60", "22"], ["Delta", "45", "140", "58"], ["Erno", "30", "45", "70"]] },
    model: [
      "The table provides information about commuting in five cities: the average length of a one-way journey, the average monthly cost and the proportion of journeys made by public transport.",
      "Overall, commutes were longest in Arlon and most expensive in Delta, while Erno stood out for combining short, cheap journeys with the highest use of public transport.",
      "Commuters in Arlon spent the most time travelling, at 52 minutes each way, followed by Delta (45 minutes) and Brisa (38 minutes). Corvo had the shortest journeys, at just 25 minutes, five minutes less than Erno. In terms of cost, Delta was the most expensive city, with an average monthly cost of $140, more than three times the figure for Erno ($45). Brisa was also relatively expensive, at $120.",
      "The use of public transport varied widely. It accounted for 70% of journeys in Erno and almost two-thirds (64%) in Arlon, and well over half in Delta (58%). In Corvo, by contrast, only 22% of commuters used public transport, the lowest figure of the five cities.",
    ],
    notes: ["With three measures, each body paragraph handles one or two columns rather than one city at a time.", "Comparisons are made across cities (“more than three times the figure for Erno”).", "No reasons are invented: Task 1 reports only what the table shows."],
    language: ["stood out for", "followed by", "in terms of cost", "more than three times the figure for", "varied widely"],
  },
  /* ---------------------------------------------------- Education */
  {
    id: "t1-05", topic: "Education", visual: "bar", title: "Science and engineering students by gender",
    prompt: "The chart below shows the percentage of male and female university students studying science and engineering subjects in three countries in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "bar", title: "University students studying science & engineering (%) · 2024", x: ["Molvania", "Rentia", "Sorvik"], series: [["Men", [48, 42, 55]], ["Women", [26, 38, 31]]], max: 60, step: 10 },
    model: [
      "The bar chart compares the percentage of male and female university students who studied science and engineering subjects in three countries in 2024.",
      "Overall, a higher proportion of men than women studied these subjects in all three countries, but the size of the gender gap varied considerably. Rentia had by far the smallest difference between the sexes, whereas the gap was widest in Sorvik.",
      "In Sorvik, more than half of male students (55%) were enrolled on science or engineering courses, compared with less than a third of female students (31%), a difference of 24 percentage points. The gap in Molvania was almost as wide, at 22 points: 48% of men studied these subjects, almost twice the figure for women (26%).",
      "Rentia presented a very different picture. Although it had the lowest proportion of male students in these fields, at 42%, its figure for women was the highest of the three countries, at 38%. As a result, the gap there was only four percentage points.",
    ],
    notes: ["The key feature is the gap between men and women, so the answer is built around it.", "“Percentage points” is used correctly for differences between percentages.", "The final paragraph contrasts the exception (Rentia) with the other two countries."],
    language: ["the gender gap varied considerably", "a difference of 24 percentage points", "almost as wide", "presented a very different picture", "as a result"],
  },
  {
    id: "t1-06", topic: "Education", visual: "line", title: "Online course enrolment by age group",
    prompt: "The graph below shows the number of people enrolled in online courses in one country, by age group, between 2012 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "line", title: "People enrolled in online courses (thousands)", x: [2012, 2015, 2018, 2021, 2024], series: [["18–24", [120, 180, 240, 410, 380]], ["25–44", [80, 150, 260, 520, 560]], ["45+", [20, 35, 60, 190, 230]]], max: 600, step: 100 },
    model: [
      "The line graph shows how many people in three age groups were enrolled in online courses in one country between 2012 and 2024.",
      "Overall, enrolment rose substantially in all three groups, with a particularly sharp increase between 2018 and 2021. Although 18- to 24-year-olds formed the largest group at the start of the period, they had been overtaken by people aged 25 to 44 well before the end.",
      "In 2012, 120,000 people aged 18 to 24 were studying online, compared with 80,000 in the 25–44 group and just 20,000 people aged 45 and over. Numbers in the two younger groups grew steadily over the next six years, and by 2018 the 25–44 group had overtaken the youngest group, with 260,000 students against 240,000.",
      "All three groups recorded their fastest growth between 2018 and 2021. Enrolment among 25- to 44-year-olds doubled to 520,000 and continued to rise slightly, to 560,000, by 2024. In contrast, the number of students aged 18 to 24 peaked at 410,000 in 2021 and then fell to 380,000. The oldest group grew more than tenfold over the period, reaching 230,000.",
    ],
    notes: ["The overview identifies the period of fastest growth and the change in the largest group.", "Thousands are converted correctly (120 → 120,000).", "Peaks and the crossover point are selected; minor movements are left out."],
    language: ["rose substantially", "had been overtaken by", "recorded their fastest growth", "peaked at", "grew more than tenfold"],
  },
  /* ---------------------------------------------------- Health */
  {
    id: "t1-07", topic: "Health", visual: "table", title: "Sleep, exercise and screen time by age",
    prompt: "The table below shows how much time people in five age groups spent sleeping, exercising and using screens each day in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "table", title: "Average daily time by age group · 2024", head: ["Age group", "Sleep (hours)", "Exercise (minutes)", "Screen time (hours)"], rows: [["13–17", "7.2", "48", "6.5"], ["18–29", "7.0", "35", "5.8"], ["30–49", "6.6", "22", "4.1"], ["50–64", "6.9", "26", "3.6"], ["65+", "7.4", "31", "3.9"]] },
    model: [
      "The table compares how much time people in five age groups spent sleeping, exercising and looking at screens each day in 2024.",
      "Overall, teenagers exercised the most and had the highest screen time, while people aged 30 to 49 slept and exercised the least. The oldest group slept the longest.",
      "Sleep varied relatively little between the groups, from 6.6 hours among 30- to 49-year-olds to 7.4 hours among those aged 65 and over. Teenagers slept for 7.2 hours on average, slightly more than young adults (7.0 hours).",
      "Differences in exercise were much greater. Teenagers exercised for 48 minutes a day, more than twice as long as people aged 30 to 49, who managed only 22 minutes. After this low point, the figure rose again with age, reaching 31 minutes for the over-65s. Screen time, meanwhile, fell steadily with age up to 64: teenagers spent 6.5 hours a day in front of screens, compared with 3.6 hours in the 50–64 group. The over-65s, however, used screens slightly more, at 3.9 hours.",
    ],
    notes: ["The answer contrasts a measure with small differences (sleep) with one with large differences (exercise).", "Patterns are described (“rose again with age”, “fell steadily”) rather than every cell.", "The exception in screen time (the over-65s) is highlighted."],
    language: ["varied relatively little", "more than twice as long as", "after this low point", "fell steadily with age", "in front of screens"],
  },
  {
    id: "t1-08", topic: "Health", visual: "pie", title: "Where daily calories come from",
    prompt: "The pie charts below show the sources of daily calories in the average diet in one country in 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "pie", title: "Sources of daily calories (%)", pies: [{ label: "1980", slices: [["Grains & bread", 38], ["Fruit & vegetables", 14], ["Meat & fish", 16], ["Dairy", 12], ["Sugar & sweets", 9], ["Fats & oils", 11]] }, { label: "2020", slices: [["Grains & bread", 29], ["Fruit & vegetables", 11], ["Meat & fish", 18], ["Dairy", 10], ["Sugar & sweets", 17], ["Fats & oils", 15]] }] },
    model: [
      "The pie charts show where the average person's daily calories came from in one country in 1980 and 2020.",
      "Overall, grains and bread remained the largest source of energy in both years, but their share declined, while sugar and fats made up a much larger proportion of the diet by 2020.",
      "In 1980, grains and bread provided 38% of daily calories, more than twice as much as any other food group. Meat and fish were the next most important source, at 16%, followed by fruit and vegetables (14%) and dairy products (12%). Fats and oils accounted for 11%, and sugar and sweets for just 9%.",
      "By 2020, the share of grains and bread had fallen to 29%. The most notable change was in sugar and sweets, whose share almost doubled to 17%, so that they provided almost as many calories as meat and fish (18%). Fats and oils also rose, to 15%. Meanwhile, the proportions from fruit and vegetables and from dairy both fell slightly, to 11% and 10% respectively.",
    ],
    notes: ["Both pies are compared directly in the second body paragraph.", "The largest change (sugar) is singled out as “the most notable change”.", "Accurate comparison: sugar is “almost as many” as meat and fish, not larger."],
    language: ["the largest source of", "more than twice as much as", "the next most important source", "almost doubled", "respectively"],
  },
  /* ---------------------------------------------------- Work & economy */
  {
    id: "t1-09", topic: "Work & economy", visual: "line", title: "Unemployment in three regions",
    prompt: "The graph below shows the unemployment rate in three regions of one country between 2008 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "line", title: "Unemployment rate (%)", x: [2008, 2011, 2014, 2017, 2020, 2023], series: [["North", [5, 9, 8, 6, 7, 5]], ["Coast", [7, 11, 12, 10, 9, 8]], ["Capital", [4, 6, 5, 4, 8, 4]]], max: 14, step: 2 },
    model: [
      "The line graph shows the unemployment rate in three regions of one country between 2008 and 2023.",
      "Overall, unemployment was consistently highest in the Coast region, and for most of the period it was lowest in the Capital. All three regions saw rising unemployment after 2008, but by 2023 the rates in the North and the Capital had returned to their original levels.",
      "In 2008, 7% of the workforce in the Coast region was unemployed, compared with 5% in the North and 4% in the Capital. Over the next three years, the rate rose by four percentage points in both the Coast and the North, to 11% and 9% respectively. The Coast's figure continued to climb, peaking at 12% in 2014, before falling gradually to 8% by 2023, still one point above its 2008 level.",
      "In the North, unemployment declined steadily after 2011 to 6% in 2017, rose briefly to 7% in 2020, and then fell back to 5%. The Capital followed a different pattern: its rate stayed between 4% and 6% for most of the period, but it doubled from 4% to 8% in 2020, overtaking the North, before dropping back to 4% by 2023.",
    ],
    notes: ["The overview is qualified (“for most of the period”) because the Capital was not lowest in 2020.", "The two regions with the same early rise are grouped in one sentence.", "The unusual 2020 spike in the Capital is clearly highlighted."],
    language: ["consistently highest", "returned to their original levels", "peaking at", "fell back to", "followed a different pattern"],
  },
  {
    id: "t1-10", topic: "Work & economy", visual: "bar", title: "Working hours by sector and gender",
    prompt: "The chart below shows the average number of hours worked per week by men and women in five sectors in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "bar", title: "Average weekly working hours · 2024", x: ["Agriculture", "Manufacturing", "Retail", "Health care", "Education"], series: [["Men", [48, 42, 36, 40, 41]], ["Women", [41, 38, 28, 34, 39]]], max: 50, step: 10 },
    model: [
      "The bar chart compares the average number of hours worked per week by men and women in five sectors in 2024.",
      "Overall, men worked longer hours than women in every sector, and people in agriculture worked the longest hours of all. Retail had the shortest working week for both sexes.",
      "Men in agriculture worked an average of 48 hours a week, the highest figure on the chart, while women in the same sector worked 41 hours. In manufacturing, the figures were 42 hours for men and 38 for women. In health care and education, men worked similar hours, at 40 and 41 hours respectively. However, women in education worked almost as long as men (39 hours), whereas in health care the difference was six hours, with women working 34 hours.",
      "Retail stood out for having both the shortest hours and the widest gender gap. Men in this sector worked 36 hours a week, compared with only 28 hours for women, a difference of eight hours.",
    ],
    notes: ["The answer identifies two different patterns: hours by sector and the gender gap.", "Education (smallest gap) and retail (largest gap) are contrasted.", "Figures are always linked to a comparison."],
    language: ["the highest figure on the chart", "in the same sector", "almost as long as", "stood out for", "the widest gender gap"],
  },
  /* ---------------------------------------------------- Technology */
  {
    id: "t1-11", topic: "Technology", visual: "line", title: "Internet users in four countries",
    prompt: "The graph below shows the number of internet users per 100 people in four countries between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "line", title: "Internet users per 100 people", x: [2000, 2005, 2010, 2015, 2020, 2025], series: [["Halvard", [45, 72, 85, 91, 95, 97]], ["Orinza", [8, 20, 40, 62, 78, 88]], ["Pelago", [4, 15, 33, 52, 70, 80]], ["Taruma", [1, 2, 8, 20, 33, 45]]], max: 100, step: 20 },
    model: [
      "The line graph illustrates the number of internet users per 100 people in four countries between 2000 and 2025.",
      "Overall, internet use increased in all four countries, and the gap between them narrowed considerably. Halvard had the highest rate throughout, while Taruma had the lowest.",
      "In 2000, Halvard already had 45 internet users per 100 people, far more than the other three countries, none of which had more than eight. Halvard's figure rose rapidly to 85 in 2010, after which growth slowed as it approached 100, reaching 97 by 2025.",
      "Orinza and Pelago followed similar paths, with steady and substantial growth throughout the period. Orinza's rate climbed from 8 to 88, while Pelago's rose from 4 to 80, so both had narrowed the gap with Halvard considerably by the end of the period. Taruma started from a very low base, with just one user per 100 people in 2000, and its figure was still only 8 in 2010. However, growth accelerated after that, and by 2025, 45 in every 100 people were online.",
    ],
    notes: ["Two similar lines (Orinza and Pelago) are grouped together.", "The slowing growth in Halvard is described accurately without claiming a cause.", "The overview captures the narrowing gap, which is the main story."],
    language: ["the gap between them narrowed", "growth slowed", "followed similar paths", "started from a very low base", "growth accelerated"],
  },
  {
    id: "t1-12", topic: "Technology", visual: "table", title: "Devices owned by teenagers",
    prompt: "The table below shows the percentage of teenagers in one country who owned six types of electronic device in 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "table", title: "Teenagers (13–17) owning each device (%)", head: ["Device", "2010", "2025"], rows: [["Smartphone", "38", "95"], ["Laptop", "45", "72"], ["Tablet", "12", "48"], ["Games console", "64", "58"], ["Smartwatch", "0", "31"], ["MP3 player", "70", "4"]] },
    model: [
      "The table shows the percentage of teenagers aged 13 to 17 in one country who owned six different types of electronic device in 2010 and 2025.",
      "Overall, ownership of most devices rose over the period, with smartphones becoming almost universal. In contrast, MP3 players had almost disappeared by 2025, and games consoles became slightly less common.",
      "In 2010, the most widely owned devices were MP3 players (70%) and games consoles (64%). Fewer than half of all teenagers owned a laptop (45%) or a smartphone (38%), and only 12% had a tablet. At that time, no teenagers at all owned a smartwatch.",
      "By 2025, the picture had changed dramatically. Smartphone ownership had risen to 95%, and laptops were owned by almost three-quarters of teenagers (72%). Tablet ownership quadrupled to 48%, and smartwatches were owned by 31%. The only devices to decline were games consoles, which fell slightly to 58%, and MP3 players, which collapsed from 70% to just 4%.",
    ],
    notes: ["The two years are compared paragraph by paragraph, a clear structure for a two-column table.", "Strong, accurate verbs for big changes: “quadrupled”, “collapsed”.", "Both declining devices are grouped in the final sentence."],
    language: ["almost universal", "the most widely owned", "the picture had changed dramatically", "quadrupled", "collapsed from … to"],
  },
  /* ---------------------------------------------------- Population */
  {
    id: "t1-13", topic: "Population", visual: "bar", title: "Population by age group",
    prompt: "The chart below shows the population of one country by age group in 1975 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "bar", title: "Population by age group (millions)", x: ["0–14", "15–29", "30–44", "45–64", "65+"], series: [["1975", [12, 10, 8, 7, 3]], ["2025", [8, 9, 10, 12, 9]]], max: 14, step: 2 },
    model: [
      "The bar chart compares the number of people in five age groups in one country in 1975 and 2025.",
      "Overall, the population aged considerably over the fifty-year period. While children made up the largest group in 1975, the 45–64 age group was the largest by 2025, and the number of people aged 65 and over had tripled.",
      "In 1975, there were 12 million children under the age of 15, more than in any other group. The size of each group then fell steadily with age, from 10 million people aged 15 to 29 to just 3 million aged 65 and over.",
      "By 2025, this pattern had largely reversed. The number of children had fallen by a third, to 8 million, and the 15–29 group had shrunk slightly to 9 million. By contrast, the 30–44 group grew to 10 million, and the 45–64 group rose by more than two-thirds, from 7 million to 12 million. The most dramatic change was among the over-65s, whose number rose from 3 million to 9 million.",
    ],
    notes: ["The overview interprets the whole chart in one idea: the population aged.", "Precise fractions: “fallen by a third”, “rose by more than two-thirds”.", "Shrinking and growing groups are contrasted with “By contrast”."],
    language: ["aged considerably", "fell steadily with age", "had largely reversed", "had shrunk slightly", "the most dramatic change"],
  },
  {
    id: "t1-14", topic: "Population", visual: "two visuals", title: "Age at first marriage and household size",
    prompt: "The graph below shows the average age at which men and women first married in one country between 1970 and 2020, and the table shows average household size in three years. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: [
      { type: "line", title: "Average age at first marriage", x: [1970, 1980, 1990, 2000, 2010, 2020], series: [["Men", [25, 26, 27.5, 29, 31, 32]], ["Women", [22, 23, 25, 27, 29, 30.5]]], min: 20, max: 35, step: 5 },
      { type: "table", title: "Average household size", head: ["Year", "People per household"], rows: [["1970", "3.6"], ["1995", "3.0"], ["2020", "2.4"]] },
    ],
    model: [
      "The line graph shows the average age at which men and women in one country first married between 1970 and 2020, while the table gives the average number of people per household in three years.",
      "Overall, people married later and households became smaller over the period. Men consistently married at an older age than women, but the gap between them narrowed slightly.",
      "In 1970, men married for the first time at an average age of 25, three years older than women (22). Both figures then rose steadily. By 2000, the average age had reached 29 for men and 27 for women, and by 2020 it stood at 32 and 30.5 respectively. As a result, the difference between men and women fell from three years to one and a half.",
      "At the same time, average household size fell steadily, from 3.6 people in 1970 to 3.0 in 1995 and 2.4 in 2020, a drop of one third over the fifty years.",
    ],
    notes: ["The overview covers both visuals, which is essential with two charts.", "Each visual gets its own paragraph, linked with “At the same time”.", "The calculated change (a drop of one third) is accurate: 3.6 → 2.4."],
    language: ["consistently", "the gap narrowed slightly", "it stood at", "as a result", "a drop of one third"],
  },
  /* ---------------------------------------------------- Food & production */
  {
    id: "t1-15", topic: "Food & production", visual: "process", title: "How chocolate is made",
    prompt: "The diagram below shows how chocolate is produced. Summarise the information by selecting and reporting the main features.",
    chart: { type: "process", title: "Chocolate production", steps: ["Ripe cacao pods are harvested by hand (farm)", "Beans are removed and fermented for 5–7 days (farm)", "Beans are dried in the sun (farm)", "Beans are taken to a factory and roasted", "Shells are removed, leaving cocoa nibs", "Nibs are ground into a paste (cocoa liquor)", "Sugar and milk are added; the mixture is heated and mixed (conching)", "Chocolate is cooled, moulded and packaged"] },
    model: [
      "The diagram illustrates the stages involved in turning cacao pods into chocolate bars.",
      "Overall, the process consists of eight main stages, beginning with the harvesting of the pods and ending with the packaging of the finished chocolate. The first three stages take place on the farm, and the rest in a factory.",
      "To begin with, ripe cacao pods are harvested by hand. The beans are then removed from the pods and left to ferment for between five and seven days, after which they are spread out and dried in the sun.",
      "Once they have dried, the beans are taken to a factory, where they are roasted. Following this, their shells are removed, leaving small pieces known as cocoa nibs. These are ground into a thick paste called cocoa liquor. At the next stage, sugar and milk are added, and the mixture is heated and mixed, a process known as conching. Finally, the chocolate is cooled, poured into moulds and packaged, ready to be sold.",
    ],
    notes: ["The present passive is used throughout, as processes require.", "Sequencers are varied: to begin with, then, after which, once, following this, at the next stage, finally.", "The overview counts the stages and gives the start and end points."],
    language: ["the process consists of", "to begin with", "after which", "once they have dried", "a process known as"],
  },
  {
    id: "t1-16", topic: "Food & production", visual: "process", title: "How black tea is produced",
    prompt: "The diagram below shows the stages in the production of black tea. Summarise the information by selecting and reporting the main features.",
    chart: { type: "process", title: "Black tea production", steps: ["Young leaves are picked by hand", "Leaves are spread out to wither for 12–18 hours", "Leaves are rolled to break their surface", "Leaves are left to oxidise and turn dark", "Leaves are dried with hot air", "Tea is sorted and graded by leaf size", "Tea is packed and shipped"] },
    model: [
      "The diagram shows how black tea is produced, from picking the leaves to shipping the finished product.",
      "Overall, there are seven stages in the process, which begins in the tea fields and ends with the finished product being sent to customers. Most of the stages involve treating the leaves so that they change in texture and colour, while the final two prepare the tea for sale.",
      "The process begins when young tea leaves are picked by hand. They are then spread out and left to wither for between 12 and 18 hours, which softens them. Next, the leaves are rolled in order to break their surface, after which they are left to oxidise, a stage in which they gradually turn dark.",
      "Once oxidation is complete, the leaves are dried with hot air. The dried tea is then sorted and graded according to the size of the leaves. In the final stage, the tea is packed and shipped to customers.",
    ],
    notes: ["A short process is still written at full length by grouping the stages logically.", "Purpose clauses (“in order to break their surface”) add grammatical range.", "Relative clauses (“a stage in which…”) connect stages smoothly."],
    language: ["the process begins when", "in order to", "after which", "once oxidation is complete", "according to"],
  },
  /* ---------------------------------------------------- Cities & places */
  {
    id: "t1-17", topic: "Cities & places", visual: "map", title: "Changes to a town centre",
    prompt: "The maps below show the centre of the town of Riverton in 1990 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "map", title: "Riverton town centre", maps: [
      { label: "1990", items: [["road", 0, 92, 300, 18, "High Street"], ["water", 0, 192, 300, 28, "River"], ["park", 10, 10, 110, 72, "Park"], ["building", 180, 10, 110, 72, "Factory"], ["empty", 125, 10, 50, 72, ""], ["square", 105, 122, 90, 58, "Market square"], ["car", 10, 122, 85, 58, "Car park"], ["building", 205, 122, 85, 58, "Houses"]] },
      { label: "2025", items: [["road", 0, 92, 300, 18, "High Street"], ["water", 0, 192, 300, 28, "River"], ["park", 10, 10, 110, 72, "Park"], ["building", 180, 10, 110, 72, "Apartments"], ["building", 125, 10, 50, 72, "Bus station"], ["square", 105, 122, 90, 58, "Pedestrian plaza"], ["building", 10, 122, 85, 58, "Shopping centre"], ["building", 205, 122, 85, 58, "Houses"], ["road", 140, 180, 20, 40, "Bridge"]] },
    ] },
    model: [
      "The maps show how the centre of Riverton changed between 1990 and 2025.",
      "Overall, the town centre became more residential and more focused on shopping, with industry disappearing and new transport links being added. The park and the houses, however, remained unchanged.",
      "In 1990, the land to the north of the High Street was occupied by a park in the north-west and a factory in the north-east, with an empty site between them. By 2025, the factory had been demolished and replaced by apartments, and a bus station had been built on the empty site. The park was unchanged.",
      "To the south of the High Street, the most noticeable change was in the west, where the car park was converted into a shopping centre. The market square in the middle was turned into a pedestrian plaza, while the houses in the south-east were left as they were. Finally, a new bridge was constructed across the river, directly south of the plaza.",
    ],
    notes: ["The maps are described area by area (north, then south of the High Street).", "The past passive dominates: was demolished, was converted into, was constructed.", "Location language is precise and consistent: north-west, directly south of."],
    language: ["was occupied by", "had been demolished and replaced by", "was converted into", "were left as they were", "directly south of"],
  },
  {
    id: "t1-18", topic: "Cities & places", visual: "map", title: "Plans for a university campus",
    prompt: "The maps below show a university campus at present and a plan for its development. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "map", title: "University campus", maps: [
      { label: "Present", items: [["road", 140, 135, 20, 85, "Entrance"], ["car", 110, 10, 80, 55, "Car park"], ["building", 110, 75, 80, 50, "Library"], ["building", 210, 60, 80, 70, "Lecture halls"], ["building", 10, 60, 80, 70, "Student housing"], ["park", 10, 145, 120, 65, "Sports field"], ["park", 170, 145, 120, 65, "Woodland"], ["empty", 210, 10, 80, 40, ""]] },
      { label: "Proposed", items: [["road", 140, 135, 20, 85, "Entrance"], ["building", 110, 10, 80, 55, "Science building"], ["building", 100, 72, 100, 58, "Library (extended)"], ["building", 210, 60, 80, 70, "Lecture halls"], ["building", 10, 60, 80, 70, "Student housing"], ["building", 10, 145, 55, 65, "New housing"], ["park", 70, 145, 60, 65, "Sports field"], ["park", 170, 145, 120, 65, "Woodland"], ["car", 210, 10, 80, 40, "Car park"], ["square", 166, 196, 30, 16, "Bus stop"]] },
    ] },
    model: [
      "The maps compare the current layout of a university campus with a proposed plan for its development.",
      "Overall, the plan would add more academic buildings and student accommodation, mainly by building on the existing car park and part of the sports field. The lecture halls, the existing student housing and the woodland would not change.",
      "At present, the north of the campus is occupied by a car park, with the library directly to its south. Under the plan, the car park would be replaced by a new science building, and the library would be extended. A smaller car park would be built on the empty land in the north-east corner, next to the lecture halls.",
      "In the south of the campus, the sports field in the south-west would be reduced to about half its current size, and new student housing would be built on the western part of the site. The woodland in the south-east would be kept, and a bus stop would be added beside the main entrance.",
    ],
    notes: ["A plan uses “would” (or “will”) to describe future changes.", "The overview names what changes and what stays the same.", "Each paragraph covers one area of the campus."],
    language: ["under the plan", "would be replaced by", "would be extended", "would be reduced to about half its current size", "would be kept"],
  },
  /* ---------------------------------------------------- Tourism */
  {
    id: "t1-19", topic: "Tourism", visual: "bar", title: "International tourist arrivals",
    prompt: "The chart below shows the number of international tourists who visited five countries in 2019 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "bar", title: "International tourist arrivals (millions)", x: ["Alvaria", "Bremont", "Castria", "Delmar", "Esland"], series: [["2019", [32, 18, 25, 9, 14]], ["2024", [35, 15, 30, 16, 14]]], max: 40, step: 10 },
    model: [
      "The bar chart compares the number of international tourists who visited five countries in 2019 and 2024.",
      "Overall, Alvaria received the most visitors in both years, and three of the five countries welcomed more tourists in 2024 than in 2019. The fastest growth was in Delmar, while Bremont was the only country to see a decline.",
      "In 2019, Alvaria attracted 32 million international visitors, followed by Castria with 25 million and Bremont with 18 million. Esland and Delmar received considerably fewer, at 14 million and 9 million respectively, so Delmar was the least visited of the five countries.",
      "Five years later, Alvaria's figure had risen to 35 million, and Castria's to 30 million. The most remarkable change was in Delmar, where tourist numbers almost doubled to 16 million, overtaking both Esland and Bremont. In contrast, arrivals in Bremont fell from 18 million to 15 million, while Esland's figure remained unchanged at 14 million. As a result, the gap between the most and least visited countries narrowed.",
    ],
    notes: ["The overview covers the leader, the general trend and the two exceptions.", "Both years are described in turn, with the changes highlighted in the second body paragraph.", "Overtaking is identified correctly: Delmar (16) passes Esland (14) and Bremont (15)."],
    language: ["received the most visitors", "welcomed more tourists", "followed by", "the most remarkable change", "remained unchanged at"],
  },
  {
    id: "t1-20", topic: "Tourism", visual: "pie", title: "How tourists spend their money",
    prompt: "The pie charts below show how international and domestic tourists spent their money in one city in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chart: { type: "pie", title: "Tourist spending by category (%) · 2024", pies: [{ label: "International tourists", slices: [["Accommodation", 38], ["Food & drink", 22], ["Shopping", 18], ["Transport", 10], ["Entertainment", 12]] }, { label: "Domestic tourists", slices: [["Accommodation", 24], ["Food & drink", 30], ["Shopping", 16], ["Transport", 18], ["Entertainment", 12]] }] },
    model: [
      "The pie charts compare how international and domestic tourists divided their spending between five categories during visits to one city in 2024.",
      "Overall, international tourists spent the largest share of their money on accommodation, whereas domestic tourists spent the most on food and drink. The two groups spent exactly the same proportion on entertainment.",
      "Accommodation accounted for 38% of international tourists' spending, compared with only 24% for domestic visitors. Food and drink made up the next largest share for international tourists (22%), but it was the biggest category for domestic tourists, at 30%. Shopping represented a similar proportion for both groups, at 18% and 16% respectively.",
      "There was also a marked difference in transport. Domestic tourists spent 18% of their budget on getting around, almost twice the proportion spent by international visitors (10%). Entertainment accounted for 12% of spending in both cases, the only category in which the two groups were identical.",
    ],
    notes: ["Two groups at one point in time: the answer compares them category by category.", "The overview names each group's largest category and the one identical figure.", "Comparatives are accurate: 18% is “almost twice” 10%."],
    language: ["divided their spending between", "accounted for", "made up the next largest share", "represented a similar proportion", "almost twice the proportion"],
  },
];
