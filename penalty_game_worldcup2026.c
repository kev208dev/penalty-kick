#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <windows.h>
#include <conio.h>

// 패널티킥 게임 만들기 프로젝트!!
// 2026 월드컵 실제 선수 명단 추가함!!

#define RED    12
#define GREEN  10
#define YELLOW 14
#define CYAN   11
#define WHITE   7
#define PINK   13

#define NARA_SU   12
#define PLAYER_SU 26

// 선수 구조체 (구조체 처음 써봄)
typedef struct {
    int  num;
    char name[60];
    char pos[4];   // GK DF MF FW
    char club[60];
} Seonsu;

// 선수 데이터 전역으로 넣음 (main에 넣으니까 너무 길어서)
Seonsu roster[NARA_SU][PLAYER_SU] = {
    // 0. 한국
    {
        { 1, "김승규",           "GK", "FC Tokyo" },
        {12, "송범근",           "GK", "Jeonbuk Hyundai Motors" },
        {21, "조현우",           "GK", "Ulsan HD" },
        { 2, "이한범",           "DF", "Midtjylland" },
        { 4, "김민재",           "DF", "Bayern Munich" },
        { 5, "김태현",           "DF", "Kashima Antlers" },
        {13, "이태석",           "DF", "Austria Wien" },
        {14, "조위제",           "DF", "Jeonbuk Hyundai Motors" },
        {15, "김문환",           "DF", "Daejeon Hana Citizen" },
        {16, "박진섭",           "DF", "Zhejiang" },
        {22, "설영우",           "DF", "Red Star Belgrade" },
        {23, "옌스 카스트로프",  "DF", "Borussia Monchengladbach" },
        { 3, "이기혁",           "MF", "Gangwon FC" },
        { 6, "황인범",           "MF", "Feyenoord" },
        { 8, "백승호",           "MF", "Birmingham City" },
        {10, "이재성",           "MF", "Mainz 05" },
        {11, "황희찬",           "MF", "Wolverhampton Wanderers" },
        {17, "배준호",           "MF", "Stoke City" },
        {19, "이강인",           "MF", "Paris Saint-Germain" },
        {20, "양현준",           "MF", "Celtic" },
        {24, "김진규",           "MF", "Jeonbuk Hyundai Motors" },
        {25, "엄지성",           "MF", "Swansea City" },
        {26, "이동경",           "MF", "Ulsan HD" },
        { 7, "손흥민 (주장)",    "FW", "Los Angeles FC" },
        { 9, "조규성",           "FW", "Midtjylland" },
        {18, "오현규",           "FW", "Besiktas" },
    },
    // 1. 일본
    {
        { 1, "Zion Suzuki",        "GK", "Parma" },
        {12, "Keisuke Osako",      "GK", "Sanfrecce Hiroshima" },
        {23, "Tomoki Hayakawa",    "GK", "Kashima Antlers" },
        { 2, "Yukinari Sugawara",  "DF", "Werder Bremen" },
        { 3, "Shogo Taniguchi",    "DF", "Sint-Truiden" },
        { 4, "Ko Itakura (주장)",  "DF", "Ajax" },
        { 5, "Yuto Nagatomo",      "DF", "FC Tokyo" },
        {16, "Tsuyoshi Watanabe",  "DF", "Feyenoord" },
        {20, "Ayumu Seko",         "DF", "Le Havre" },
        {21, "Hiroki Ito",         "DF", "Bayern Munich" },
        {22, "Takehiro Tomiyasu",  "DF", "Ajax" },
        {25, "Junnosuke Suzuki",   "DF", "Copenhagen" },
        { 7, "Ao Tanaka",          "MF", "Leeds United" },
        { 8, "Takefusa Kubo",      "MF", "Real Sociedad" },
        {10, "Ritsu Doan",         "MF", "Eintracht Frankfurt" },
        {11, "Daizen Maeda",       "MF", "Celtic" },
        {13, "Keito Nakamura",     "MF", "Reims" },
        {14, "Junya Ito",          "MF", "Genk" },
        {15, "Daichi Kamada",      "MF", "Crystal Palace" },
        {17, "Yuito Suzuki",       "MF", "SC Freiburg" },
        {24, "Kaishu Sano",        "MF", "Mainz 05" },
        { 6, "Shuto Machino",      "FW", "Borussia Monchengladbach" },
        { 9, "Keisuke Goto",       "FW", "Sint-Truiden" },
        {18, "Ayase Ueda",         "FW", "Feyenoord" },
        {19, "Koki Ogawa",         "FW", "NEC" },
        {26, "Kento Shiogai",      "FW", "VfL Wolfsburg" },
    },
    // 2. 브라질
    {
        { 1, "Alisson",            "GK", "Liverpool" },
        {12, "Weverton",           "GK", "Gremio" },
        {23, "Ederson Moraes",     "GK", "Fenerbahce" },
        { 3, "Gabriel Magalhaes",  "DF", "Arsenal" },
        { 4, "Marquinhos (주장)",  "DF", "Paris Saint-Germain" },
        { 6, "Alex Sandro",        "DF", "Flamengo" },
        {13, "Danilo Luiz",        "DF", "Flamengo" },
        {14, "Bremer",             "DF", "Juventus" },
        {15, "Leo Pereira",        "DF", "Flamengo" },
        {16, "Douglas Santos",     "DF", "Zenit Saint Petersburg" },
        {24, "Roger Ibanez",       "DF", "Al-Ahli" },
        { 2, "Ederson Silva",      "MF", "Atalanta" },
        { 5, "Casemiro",           "MF", "Manchester United" },
        { 8, "Bruno Guimaraes",    "MF", "Newcastle United" },
        {17, "Fabinho",            "MF", "Al-Ittihad" },
        {18, "Danilo Santos",      "MF", "Botafogo" },
        {20, "Lucas Paqueta",      "MF", "Flamengo" },
        { 7, "Vinicius Junior",    "FW", "Real Madrid" },
        { 9, "Matheus Cunha",      "FW", "Manchester United" },
        {10, "Neymar",             "FW", "Santos" },
        {11, "Raphinha",           "FW", "Barcelona" },
        {19, "Endrick",            "FW", "Lyon" },
        {21, "Luiz Henrique",      "FW", "Zenit Saint Petersburg" },
        {22, "Gabriel Martinelli", "FW", "Arsenal" },
        {25, "Igor Thiago",        "FW", "Brentford" },
        {26, "Rayan",              "FW", "Bournemouth" },
    },
    // 3. 아르헨티나
    {
        { 1, "Juan Musso",             "GK", "Atletico Madrid" },
        {12, "Geronimo Rulli",         "GK", "Marseille" },
        {23, "Emiliano Martinez",      "GK", "Aston Villa" },
        { 2, "Marcos Senesi",          "DF", "Bournemouth" },
        { 3, "Nicolas Tagliafico",     "DF", "Lyon" },
        { 4, "Gonzalo Montiel",        "DF", "River Plate" },
        { 6, "Lisandro Martinez",      "DF", "Manchester United" },
        {13, "Cristian Romero",        "DF", "Tottenham Hotspur" },
        {19, "Nicolas Otamendi",       "DF", "Benfica" },
        {25, "Facundo Medina",         "DF", "Marseille" },
        {26, "Nahuel Molina",          "DF", "Atletico Madrid" },
        { 5, "Leandro Paredes",        "MF", "Boca Juniors" },
        { 7, "Rodrigo De Paul",        "MF", "Inter Miami CF" },
        { 8, "Valentin Barco",         "MF", "Strasbourg" },
        {11, "Giovani Lo Celso",       "MF", "Real Betis" },
        {14, "Exequiel Palacios",      "MF", "Bayer Leverkusen" },
        {15, "Nicolas Gonzalez",       "MF", "Atletico Madrid" },
        {20, "Alexis Mac Allister",    "MF", "Liverpool" },
        {24, "Enzo Fernandez",         "MF", "Chelsea" },
        { 9, "Julian Alvarez",         "FW", "Atletico Madrid" },
        {10, "Lionel Messi (주장)",    "FW", "Inter Miami CF" },
        {16, "Thiago Almada",          "FW", "Atletico Madrid" },
        {17, "Giuliano Simeone",       "FW", "Atletico Madrid" },
        {18, "Nico Paz",               "FW", "Como" },
        {21, "Jose Manuel Lopez",      "FW", "Palmeiras" },
        {22, "Lautaro Martinez",       "FW", "Inter Milan" },
    },
    // 4. 프랑스
    {
        { 1, "Brice Samba",          "GK", "Rennes" },
        {16, "Mike Maignan",         "GK", "Milan" },
        {23, "Robin Risser",         "GK", "Lens" },
        { 2, "Malo Gusto",           "DF", "Chelsea" },
        { 3, "Lucas Digne",          "DF", "Aston Villa" },
        { 4, "Dayot Upamecano",      "DF", "Bayern Munich" },
        { 5, "Jules Kounde",         "DF", "Barcelona" },
        {15, "Ibrahima Konate",      "DF", "Liverpool" },
        {17, "William Saliba",       "DF", "Arsenal" },
        {19, "Theo Hernandez",       "DF", "Al-Hilal" },
        {21, "Lucas Hernandez",      "DF", "Paris Saint-Germain" },
        {26, "Maxence Lacroix",      "DF", "Crystal Palace" },
        { 6, "Manu Kone",            "MF", "Roma" },
        { 8, "Aurelien Tchouameni",  "MF", "Real Madrid" },
        {13, "N'Golo Kante",         "MF", "Fenerbahce" },
        {14, "Adrien Rabiot",        "MF", "Milan" },
        {18, "Warren Zaire-Emery",   "MF", "Paris Saint-Germain" },
        {24, "Rayan Cherki",         "MF", "Manchester City" },
        {25, "Maghnes Akliouche",    "MF", "Monaco" },
        { 7, "Ousmane Dembele",      "FW", "Paris Saint-Germain" },
        { 9, "Marcus Thuram",        "FW", "Inter Milan" },
        {10, "Kylian Mbappe (주장)", "FW", "Real Madrid" },
        {11, "Michael Olise",        "FW", "Bayern Munich" },
        {12, "Bradley Barcola",      "FW", "Paris Saint-Germain" },
        {20, "Desire Doue",          "FW", "Paris Saint-Germain" },
        {22, "Jean-Philippe Mateta", "FW", "Crystal Palace" },
    },
    // 5. 잉글랜드
    {
        { 1, "Jordan Pickford",   "GK", "Everton" },
        {13, "Dean Henderson",    "GK", "Crystal Palace" },
        {23, "James Trafford",    "GK", "Manchester City" },
        { 2, "Ezri Konsa",        "DF", "Aston Villa" },
        { 3, "Nico O'Reilly",     "DF", "Manchester City" },
        { 5, "John Stones",       "DF", "Manchester City" },
        { 6, "Marc Guehi",        "DF", "Manchester City" },
        {12, "Tino Livramento",   "DF", "Newcastle United" },
        {15, "Dan Burn",          "DF", "Newcastle United" },
        {24, "Reece James",       "DF", "Chelsea" },
        {25, "Djed Spence",       "DF", "Tottenham Hotspur" },
        {26, "Jarell Quansah",    "DF", "Bayer Leverkusen" },
        { 4, "Declan Rice",       "MF", "Arsenal" },
        { 8, "Elliot Anderson",   "MF", "Nottingham Forest" },
        {10, "Jude Bellingham",   "MF", "Real Madrid" },
        {14, "Jordan Henderson",  "MF", "Brentford" },
        {16, "Kobbie Mainoo",     "MF", "Manchester United" },
        {17, "Morgan Rogers",     "MF", "Aston Villa" },
        {21, "Eberechi Eze",      "MF", "Arsenal" },
        { 7, "Bukayo Saka",       "FW", "Arsenal" },
        { 9, "Harry Kane (주장)", "FW", "Bayern Munich" },
        {11, "Marcus Rashford",   "FW", "Barcelona" },
        {18, "Anthony Gordon",    "FW", "Newcastle United" },
        {19, "Ollie Watkins",     "FW", "Aston Villa" },
        {20, "Noni Madueke",      "FW", "Arsenal" },
        {22, "Ivan Toney",        "FW", "Al-Ahli" },
    },
    // 6. 스페인
    {
        { 1, "David Raya",           "GK", "Arsenal" },
        {13, "Joan Garcia",          "GK", "Barcelona" },
        {23, "Unai Simon",           "GK", "Athletic Bilbao" },
        { 2, "Marc Pubill",          "DF", "Atletico Madrid" },
        { 3, "Alex Grimaldo",        "DF", "Bayer Leverkusen" },
        { 4, "Eric Garcia",          "DF", "Barcelona" },
        { 5, "Marcos Llorente",      "DF", "Atletico Madrid" },
        {12, "Pedro Porro",          "DF", "Tottenham Hotspur" },
        {14, "Aymeric Laporte",      "DF", "Athletic Bilbao" },
        {22, "Pau Cubarsi",          "DF", "Barcelona" },
        {24, "Marc Cucurella",       "DF", "Chelsea" },
        { 6, "Mikel Merino",         "MF", "Arsenal" },
        { 8, "Fabian Ruiz",          "MF", "Paris Saint-Germain" },
        { 9, "Gavi",                 "MF", "Barcelona" },
        {15, "Alex Baena",           "MF", "Atletico Madrid" },
        {16, "Rodri (주장)",         "MF", "Manchester City" },
        {18, "Martin Zubimendi",     "MF", "Arsenal" },
        {20, "Pedri",                "MF", "Barcelona" },
        { 7, "Ferran Torres",        "FW", "Barcelona" },
        {10, "Dani Olmo",            "FW", "Barcelona" },
        {11, "Yeremy Pino",          "FW", "Crystal Palace" },
        {17, "Nico Williams",        "FW", "Athletic Bilbao" },
        {19, "Lamine Yamal",         "FW", "Barcelona" },
        {21, "Mikel Oyarzabal",      "FW", "Real Sociedad" },
        {25, "Victor Munoz",         "FW", "Osasuna" },
        {26, "Borja Iglesias",       "FW", "Celta Vigo" },
    },
    // 7. 독일
    {
        { 1, "Manuel Neuer",             "GK", "Bayern Munich" },
        {12, "Oliver Baumann",           "GK", "TSG Hoffenheim" },
        {21, "Alexander Nubel",          "GK", "VfB Stuttgart" },
        { 2, "Antonio Rudiger",          "DF", "Real Madrid" },
        { 3, "Waldemar Anton",           "DF", "Borussia Dortmund" },
        { 4, "Jonathan Tah",             "DF", "Bayern Munich" },
        { 6, "Joshua Kimmich (주장)",    "DF", "Bayern Munich" },
        {15, "Nico Schlotterbeck",       "DF", "Borussia Dortmund" },
        {18, "Nathaniel Brown",          "DF", "Eintracht Frankfurt" },
        {22, "David Raum",               "DF", "RB Leipzig" },
        {24, "Malick Thiaw",             "DF", "Newcastle United" },
        { 5, "Aleksandar Pavlovic",      "MF", "Bayern Munich" },
        { 8, "Leon Goretzka",            "MF", "Bayern Munich" },
        { 9, "Jamie Leweling",           "MF", "VfB Stuttgart" },
        {10, "Jamal Musiala",            "MF", "Bayern Munich" },
        {13, "Pascal Gross",             "MF", "Brighton & Hove Albion" },
        {16, "Angelo Stiller",           "MF", "VfB Stuttgart" },
        {17, "Florian Wirtz",            "MF", "Liverpool" },
        {19, "Leroy Sane",               "MF", "Galatasaray" },
        {20, "Nadiem Amiri",             "MF", "Mainz 05" },
        {23, "Felix Nmecha",             "MF", "Borussia Dortmund" },
        {25, "Assan Ouedraogo",          "MF", "RB Leipzig" },
        { 7, "Kai Havertz",              "FW", "Arsenal" },
        {11, "Nick Woltemade",           "FW", "Newcastle United" },
        {14, "Maximilian Beier",         "FW", "Borussia Dortmund" },
        {26, "Deniz Undav",              "FW", "VfB Stuttgart" },
    },
    // 8. 포르투갈
    {
        { 1, "Diogo Costa",               "GK", "Porto" },
        {12, "Jose Sa",                   "GK", "Wolverhampton Wanderers" },
        {22, "Rui Silva",                 "GK", "Sporting CP" },
        { 2, "Nelson Semedo",             "DF", "Fenerbahce" },
        { 3, "Ruben Dias",                "DF", "Manchester City" },
        { 4, "Tomas Araujo",              "DF", "Benfica" },
        { 5, "Diogo Dalot",               "DF", "Manchester United" },
        {13, "Renato Veiga",              "DF", "Villarreal" },
        {14, "Goncalo Inacio",            "DF", "Sporting CP" },
        {20, "Joao Cancelo",              "DF", "Barcelona" },
        {24, "Samu Costa",                "DF", "Mallorca" },
        {25, "Nuno Mendes",               "DF", "Paris Saint-Germain" },
        { 6, "Matheus Nunes",             "MF", "Manchester City" },
        { 8, "Bruno Fernandes",           "MF", "Manchester United" },
        {10, "Bernardo Silva",            "MF", "Manchester City" },
        {15, "Joao Neves",                "MF", "Paris Saint-Germain" },
        {21, "Ruben Neves",               "MF", "Al-Hilal" },
        {23, "Vitinha",                   "MF", "Paris Saint-Germain" },
        { 7, "Cristiano Ronaldo (주장)",  "FW", "Al-Nassr" },
        { 9, "Goncalo Ramos",             "FW", "Paris Saint-Germain" },
        {11, "Joao Felix",                "FW", "Al-Nassr" },
        {16, "Francisco Trincao",         "FW", "Sporting CP" },
        {17, "Rafael Leao",               "FW", "Milan" },
        {18, "Pedro Neto",                "FW", "Chelsea" },
        {19, "Goncalo Guedes",            "FW", "Real Sociedad" },
        {26, "Francisco Conceicao",       "FW", "Juventus" },
    },
    // 9. 네덜란드
    {
        { 1, "Bart Verbruggen",        "GK", "Brighton & Hove Albion" },
        {13, "Robin Roefs",            "GK", "Sunderland" },
        {23, "Mark Flekken",           "GK", "Bayer Leverkusen" },
        { 2, "Lutsharel Geertruida",   "DF", "Sunderland" },
        { 4, "Virgil van Dijk (주장)", "DF", "Liverpool" },
        { 5, "Nathan Ake",             "DF", "Manchester City" },
        { 6, "Jan Paul van Hecke",     "DF", "Brighton & Hove Albion" },
        {12, "Mats Wieffer",           "DF", "Brighton & Hove Albion" },
        {15, "Micky van de Ven",       "DF", "Tottenham Hotspur" },
        {22, "Denzel Dumfries",        "DF", "Inter Milan" },
        {25, "Jorrel Hato",            "DF", "Chelsea" },
        { 3, "Marten de Roon",         "MF", "Atalanta" },
        { 7, "Justin Kluivert",        "MF", "Bournemouth" },
        { 8, "Ryan Gravenberch",       "MF", "Liverpool" },
        {14, "Tijjani Reijnders",      "MF", "Manchester City" },
        {16, "Guus Til",               "MF", "PSV Eindhoven" },
        {20, "Teun Koopmeiners",       "MF", "Juventus" },
        {21, "Frenkie de Jong",        "MF", "Barcelona" },
        {26, "Quinten Timber",         "MF", "Marseille" },
        { 9, "Wout Weghorst",          "FW", "Ajax" },
        {10, "Memphis Depay",          "FW", "Corinthians" },
        {11, "Cody Gakpo",             "FW", "Liverpool" },
        {17, "Noa Lang",               "FW", "Galatasaray" },
        {18, "Donyell Malen",          "FW", "Roma" },
        {19, "Brian Brobbey",          "FW", "Sunderland" },
        {24, "Crysencio Summerville",  "FW", "West Ham United" },
    },
    // 10. 벨기에
    {
        { 1, "Thibaut Courtois",        "GK", "Real Madrid" },
        {12, "Senne Lammens",           "GK", "Manchester United" },
        {13, "Mike Penders",            "GK", "Strasbourg" },
        { 2, "Zeno Debast",             "DF", "Sporting CP" },
        { 3, "Arthur Theate",           "DF", "Eintracht Frankfurt" },
        { 4, "Brandon Mechele",         "DF", "Club Brugge" },
        { 5, "Maxim De Cuyper",         "DF", "Brighton & Hove Albion" },
        {15, "Thomas Meunier",          "DF", "Lille" },
        {16, "Koni De Winter",          "DF", "Milan" },
        {18, "Joaquin Seys",            "DF", "Club Brugge" },
        {21, "Timothy Castagne",        "DF", "Fulham" },
        {25, "Nathan Ngoy",             "DF", "Lille" },
        { 6, "Axel Witsel",             "MF", "Girona" },
        { 7, "Kevin De Bruyne",         "MF", "Napoli" },
        { 8, "Youri Tielemans (주장)",  "MF", "Aston Villa" },
        {19, "Diego Moreira",           "MF", "Strasbourg" },
        {20, "Hans Vanaken",            "MF", "Club Brugge" },
        {22, "Alexis Saelemaekers",     "MF", "Milan" },
        {23, "Nicolas Raskin",          "MF", "Rangers" },
        {24, "Amadou Onana",            "MF", "Aston Villa" },
        { 9, "Romelu Lukaku",           "FW", "Napoli" },
        {10, "Leandro Trossard",        "FW", "Arsenal" },
        {11, "Jeremy Doku",             "FW", "Manchester City" },
        {14, "Dodi Lukebakio",          "FW", "Benfica" },
        {17, "Charles De Ketelaere",    "FW", "Atalanta" },
        {26, "Matias Fernandez-Pardo",  "FW", "Lille" },
    },
    // 11. 크로아티아
    {
        { 1, "Dominik Livakovic",    "GK", "Dinamo Zagreb" },
        {12, "Ivor Pandur",          "GK", "Hull City" },
        {23, "Dominik Kotarski",     "GK", "Copenhagen" },
        { 2, "Josip Stanisic",       "DF", "Bayern Munich" },
        { 3, "Marin Pongraci",       "DF", "Fiorentina" },
        { 4, "Josko Gvardiol",       "DF", "Manchester City" },
        { 5, "Duje Caleta-Car",      "DF", "Real Sociedad" },
        { 6, "Josip Sutalo",         "DF", "Ajax" },
        {18, "Kristijan Jakic",      "DF", "FC Augsburg" },
        {22, "Luka Vuskovic",        "DF", "Hamburger SV" },
        {25, "Martin Erlic",         "DF", "Midtjylland" },
        { 7, "Nikola Moro",          "MF", "Bologna" },
        { 8, "Mateo Kovacic",        "MF", "Manchester City" },
        {10, "Luka Modric (주장)",   "MF", "Milan" },
        {13, "Nikola Vlasic",        "MF", "Torino" },
        {15, "Mario Pasalic",        "MF", "Atalanta" },
        {16, "Martin Baturina",      "MF", "Como" },
        {17, "Petar Sucic",          "MF", "Inter Milan" },
        {19, "Toni Fruk",            "MF", "Rijeka" },
        {21, "Luka Sucic",           "MF", "Real Sociedad" },
        { 9, "Andrej Kramaric",      "FW", "TSG Hoffenheim" },
        {11, "Ante Budimir",         "FW", "Osasuna" },
        {14, "Ivan Perisic",         "FW", "PSV Eindhoven" },
        {20, "Igor Matanovic",       "FW", "SC Freiburg" },
        {24, "Marco Pasalic",        "FW", "Orlando City SC" },
        {26, "Petar Musa",           "FW", "FC Dallas" },
    },
};

void saekkal(int c) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), c);
}

void title() {
    saekkal(YELLOW);
    printf("=========================================\n");
    printf("           패  널  티  킥  !!!!          \n");
    printf("=========================================\n");
    saekkal(WHITE);
}

void goalDraw() {
    saekkal(WHITE);
    printf("\n");
    printf("        +-----+-----+-----+\n");
    printf("        |     |     |     |\n");
    printf("        | [1] | [2] | [3] |\n");
    printf("        | 왼  | 중  | 오  |\n");
    printf("        |     |     |     |\n");
    printf("        +-----+-----+-----+\n");
    printf("\n");
    printf("               ( O )\n");
    printf("              /  |  \\\n");
    printf("             /   |   \\\n");
    printf("\n");
}

void scoreBoard(char n1[], char n2[], int s1, int s2) {
    saekkal(PINK);
    printf("==============================\n");
    printf("  %-10s  vs  %-10s\n", n1, n2);
    saekkal(CYAN);
    printf("      %d골        %d골\n", s1, s2);
    saekkal(PINK);
    printf("==============================\n");
    saekkal(WHITE);
    printf("\n");
}

// 선수 명단 출력 함수 (포지션별로 나눠서 보여줌)
void showRoster(int teamIdx, char nara[][20]) {
    char *posNames[4] = { "GK", "DF", "MF", "FW" };
    char *posKor[4]   = { "골키퍼", "수비수", "미드필더", "공격수" };
    int p, j;

    system("cls");
    saekkal(YELLOW);
    printf("\n=== %s 선수 명단 (26명) ===\n\n", nara[teamIdx]);

    for (p = 0; p < 4; p++) {
        saekkal(CYAN);
        printf("[%s] %s\n", posNames[p], posKor[p]);
        saekkal(WHITE);

        for (j = 0; j < PLAYER_SU; j++) {
            if (strcmp(roster[teamIdx][j].pos, posNames[p]) == 0) {
                printf("  %2d. %-25s (%s)\n",
                       roster[teamIdx][j].num,
                       roster[teamIdx][j].name,
                       roster[teamIdx][j].club);
            }
        }
        printf("\n");
    }

    saekkal(YELLOW);
    printf("아무 키나 누르면 게임 시작!!\n");
    saekkal(WHITE);
    _getch();
}

int main() {
    SetConsoleOutputCP(65001);
    srand(time(NULL));

    char nara[NARA_SU][20] = {
        "한국", "일본", "브라질", "아르헨티나",
        "프랑스", "잉글랜드", "스페인", "독일",
        "포르투갈", "네덜란드", "벨기에", "크로아티아"
    };
    int gongGyeok[NARA_SU] = { 80, 78, 95, 93, 92, 91, 89, 90, 88, 85, 84, 82 };
    int suBi[NARA_SU]      = { 82, 80, 88, 85, 90, 87, 88, 91, 84, 86, 83, 85 };

    int me, ai;
    int i;
    int myScore = 0, aiScore = 0;
    int myDir, aiDir;
    int myBlock, aiBlock;
    int result;
    int prob;
    int round;

    system("cls");
    title();
    printf("\n");
    saekkal(CYAN);
    printf("   아무 키나 누르면 시작!!\n");
    saekkal(WHITE);
    _getch();
    system("cls");

    // ===== 나라 선택 =====
    title();
    printf("\n나라를 골라라!!\n\n");
    for (i = 0; i < NARA_SU; i++) {
        printf("  %2d. %-12s  공격:%d  수비:%d\n",
               i + 1, nara[i], gongGyeok[i], suBi[i]);
    }

    printf("\n번호 입력 (1~12) : ");
    scanf("%d", &me);

    if (me < 1 || me > 12) {
        printf("잘못 눌렀음 -> 한국으로 할게\n");
        me = 1;
    }
    me = me - 1;

    // 선수 명단 보여주기
    showRoster(me, nara);

    // 상대 나라 랜덤
    do {
        ai = rand() % NARA_SU;
    } while (ai == me);

    system("cls");

    saekkal(YELLOW);
    printf("\n=========== 대결!! ===========\n");
    saekkal(WHITE);
    printf("\n   %s  VS  %s\n\n", nara[me], nara[ai]);
    printf("  내 나라    - 공격:%d  수비:%d\n", gongGyeok[me], suBi[me]);
    printf("  상대 나라  - 공격:%d  수비:%d\n", gongGyeok[ai], suBi[ai]);
    saekkal(YELLOW);
    printf("\n==============================\n");
    saekkal(WHITE);
    printf("\n아무 키나 누르면 시작!!\n");
    _getch();

    // ===== 5라운드 승부차기 =====
    for (round = 1; round <= 5; round++) {

        system("cls");
        saekkal(CYAN);
        printf("\n====== %d번째 킥 ======\n\n", round);
        saekkal(WHITE);

        scoreBoard(nara[me], nara[ai], myScore, aiScore);

        // --- 내 공격 ---
        saekkal(GREEN);
        printf(">>> 내 차례 (공격) <<<\n");
        saekkal(WHITE);
        goalDraw();

        printf("어디로 찰래??\n");
        printf("  1. 왼쪽\n");
        printf("  2. 가운데\n");
        printf("  3. 오른쪽\n");
        printf(">> ");
        scanf("%d", &myDir);
        if (myDir < 1 || myDir > 3) myDir = 2;
        myDir = myDir - 1;

        aiBlock = rand() % 3;

        if (myDir == aiBlock) {
            prob = gongGyeok[me] - suBi[ai] + 50;
            if (prob < 20) prob = 20;
            if (prob > 80) prob = 80;
            result = (rand() % 100 < prob) ? 1 : 0;
        } else {
            result = (rand() % 10 != 0) ? 1 : 0;
        }

        printf("\n  슛!!\n");
        Sleep(700);

        if (result == 1) {
            saekkal(GREEN);
            printf("\n  ★★ 골!!! 들어갔다!! ★★\n");
            myScore++;
        } else if (myDir == aiBlock) {
            saekkal(RED);
            printf("\n  막혔다!! 키퍼가 잡음ㅠ\n");
        } else {
            saekkal(RED);
            printf("\n  실축...빗나갔다ㅠㅠ\n");
        }
        saekkal(WHITE);
        Sleep(1200);

        printf("\n아무 키나 누르면 계속...");
        _getch();
        system("cls");

        // --- 상대 공격 ---
        saekkal(RED);
        printf(">>> 상대 차례 (막아라!!) <<<\n");
        saekkal(WHITE);

        scoreBoard(nara[me], nara[ai], myScore, aiScore);
        goalDraw();

        aiDir = rand() % 3;

        printf("어디 막을래??\n");
        printf("  1. 왼쪽\n");
        printf("  2. 가운데\n");
        printf("  3. 오른쪽\n");
        printf(">> ");
        scanf("%d", &myBlock);
        if (myBlock < 1 || myBlock > 3) myBlock = 2;
        myBlock = myBlock - 1;

        // 위에서 복붙하고 수정함
        if (aiDir == myBlock) {
            prob = gongGyeok[ai] - suBi[me] + 50;
            if (prob < 20) prob = 20;
            if (prob > 80) prob = 80;
            result = (rand() % 100 < prob) ? 1 : 0;
        } else {
            result = (rand() % 10 != 0) ? 1 : 0;
        }

        printf("\n  상대 슛!!\n");
        Sleep(700);

        if (result == 1) {
            saekkal(RED);
            printf("\n  상대 골.. 들어갔다\n");
            aiScore++;
        } else if (aiDir == myBlock) {
            saekkal(GREEN);
            printf("\n  ★★ 막았다!! 세이브!! ★★\n");
        } else {
            saekkal(GREEN);
            printf("\n  상대 실축!! 럭키~ㅋㅋ\n");
        }
        saekkal(WHITE);
        Sleep(1200);

        printf("\n아무 키나 누르면 계속...");
        _getch();
    }

    // 서든데스 (동점일때)
    while (myScore == aiScore) {

        system("cls");
        saekkal(RED);
        printf("\n\n  !!!! 서든데스 !!!!\n\n");
        saekkal(WHITE);
        Sleep(900);

        scoreBoard(nara[me], nara[ai], myScore, aiScore);

        // 내 슛
        goalDraw();
        printf("마지막 찬스!! 어디 찰래?\n");
        printf("  1. 왼  2. 가운데  3. 오른\n>> ");
        scanf("%d", &myDir);
        if (myDir < 1 || myDir > 3) myDir = 2;
        myDir--;

        aiBlock = rand() % 3;

        if (myDir == aiBlock) {
            prob = gongGyeok[me] - suBi[ai] + 50;
            if (prob < 20) prob = 20;
            if (prob > 80) prob = 80;
            result = (rand() % 100 < prob) ? 1 : 0;
        } else {
            result = (rand() % 10 != 0) ? 1 : 0;
        }

        Sleep(600);
        if (result == 1) {
            saekkal(GREEN); printf("\n  골!!\n"); myScore++;
        } else {
            saekkal(RED); printf("\n  실패..\n");
        }
        saekkal(WHITE);
        Sleep(1100);

        // 상대 슛
        aiDir = rand() % 3;
        printf("\n상대 차례! 어디 막을래?\n");
        printf("  1. 왼  2. 가운데  3. 오른\n>> ");
        scanf("%d", &myBlock);
        if (myBlock < 1 || myBlock > 3) myBlock = 2;
        myBlock--;

        if (aiDir == myBlock) {
            prob = gongGyeok[ai] - suBi[me] + 50;
            if (prob < 20) prob = 20;
            if (prob > 80) prob = 80;
            result = (rand() % 100 < prob) ? 1 : 0;
        } else {
            result = (rand() % 10 != 0) ? 1 : 0;
        }

        Sleep(600);
        if (result == 1) {
            saekkal(RED); printf("\n  상대 골..\n"); aiScore++;
        } else {
            saekkal(GREEN); printf("\n  막았다!\n");
        }
        saekkal(WHITE);
        Sleep(1100);
    }

    // ===== 최종 결과 =====
    system("cls");
    title();
    printf("\n");
    scoreBoard(nara[me], nara[ai], myScore, aiScore);

    if (myScore > aiScore) {
        saekkal(GREEN);
        printf("  ★★★ 이겼다!!!! ★★★\n");
        printf("  %s 최고!!\n", nara[me]);
    } else {
        saekkal(RED);
        printf("패배\n");
    }
    saekkal(WHITE);

    printf("\n\n아무 키나 눌러서 종료\n");
    _getch();

    return 0;
}
