#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#ifdef _WIN32
  #include <windows.h>
  #include <conio.h>
  #define CLEAR_SCREEN() system("cls")
#else
  #include <unistd.h>
  #include <termios.h>
  static void Sleep(unsigned ms) { usleep(ms * 1000); }
  static int _getch(void) {
      struct termios oldt, newt;
      int ch;
      tcgetattr(STDIN_FILENO, &oldt);
      newt = oldt;
      newt.c_lflag &= ~(ICANON | ECHO);
      tcsetattr(STDIN_FILENO, TCSANOW, &newt);
      ch = getchar();
      tcsetattr(STDIN_FILENO, TCSANOW, &oldt);
      return ch;
  }
  static void SetConsoleTextAttribute(void *h, int c) {
      const char *code = "\x1b[0m";
      switch (c) {
          case 12: code = "\x1b[91m"; break; // RED
          case 10: code = "\x1b[92m"; break; // GREEN
          case 14: code = "\x1b[93m"; break; // YELLOW
          case 11: code = "\x1b[96m"; break; // CYAN
          case 13: code = "\x1b[95m"; break; // PINK
          case  7: code = "\x1b[0m";  break; // WHITE/reset
      }
      (void)h;
      fputs(code, stdout);
  }
  static void *GetStdHandle(int x) { (void)x; return NULL; }
  #define STD_OUTPUT_HANDLE 0
  static void SetConsoleOutputCP(int cp) { (void)cp; }
  #define CLEAR_SCREEN() system("clear")
#endif


// 패널티킥 게임 만들기 프로젝트!!
// 2026 월드컵 실제 선수 명단 (각 팀 6명: GK 1명 + 5명)

#define RED    12
#define GREEN  10
#define YELLOW 14
#define CYAN   11
#define WHITE   7
#define PINK   13

#define NARA_SU   12
#define PLAYER_SU 6


typedef struct {
    int  num;
    char name[60];
    char pos[4];   // GK DF MF FW
    char club[60];
} Seonsu;

//선수 데이터 (각 팀 GK 1명 + 5명)
Seonsu roster[NARA_SU][PLAYER_SU] = {
    // 0. 한국
    {
        { 1, "김승규",        "GK", "FC Tokyo" },
        { 4, "김민재",        "DF", "Bayern Munich" },
        {10, "이재성",        "MF", "Mainz 05" },
        {11, "황희찬",        "MF", "Wolverhampton Wanderers" },
        {19, "이강인",        "MF", "Paris Saint-Germain" },
        { 7, "손흥민 (주장)", "FW", "Los Angeles FC" },
    },
    // 1. 일본
    {
        { 1, "Zion Suzuki",       "GK", "Parma" },
        { 4, "Ko Itakura (주장)", "DF", "Ajax" },
        { 8, "Takefusa Kubo",     "MF", "Real Sociedad" },
        {10, "Ritsu Doan",        "MF", "Eintracht Frankfurt" },
        {15, "Daichi Kamada",     "MF", "Crystal Palace" },
        {18, "Ayase Ueda",        "FW", "Feyenoord" },
    },
    // 2. 브라질
    {
        { 1, "Alisson",           "GK", "Liverpool" },
        { 4, "Marquinhos (주장)", "DF", "Paris Saint-Germain" },
        { 5, "Casemiro",          "MF", "Manchester United" },
        { 7, "Vinicius Junior",   "FW", "Real Madrid" },
        {10, "Neymar",            "FW", "Santos" },
        {11, "Raphinha",          "FW", "Barcelona" },
    },
    // 3. 아르헨티나
    {
        {23, "Emiliano Martinez",   "GK", "Aston Villa" },
        {13, "Cristian Romero",     "DF", "Tottenham Hotspur" },
        {24, "Enzo Fernandez",      "MF", "Chelsea" },
        { 9, "Julian Alvarez",      "FW", "Atletico Madrid" },
        {10, "Lionel Messi (주장)", "FW", "Inter Miami CF" },
        {22, "Lautaro Martinez",    "FW", "Inter Milan" },
    },
    // 4. 프랑스
    {
        {16, "Mike Maignan",         "GK", "Milan" },
        { 4, "Dayot Upamecano",      "DF", "Bayern Munich" },
        { 8, "Aurelien Tchouameni",  "MF", "Real Madrid" },
        { 7, "Ousmane Dembele",      "FW", "Paris Saint-Germain" },
        {10, "Kylian Mbappe (주장)", "FW", "Real Madrid" },
        {11, "Michael Olise",        "FW", "Bayern Munich" },
    },
    // 5. 잉글랜드
    {
        { 1, "Jordan Pickford",   "GK", "Everton" },
        { 5, "John Stones",       "DF", "Manchester City" },
        { 4, "Declan Rice",       "MF", "Arsenal" },
        {10, "Jude Bellingham",   "MF", "Real Madrid" },
        { 7, "Bukayo Saka",       "FW", "Arsenal" },
        { 9, "Harry Kane (주장)", "FW", "Bayern Munich" },
    },
    // 6. 스페인
    {
        { 1, "David Raya",      "GK", "Arsenal" },
        {14, "Aymeric Laporte", "DF", "Athletic Bilbao" },
        {16, "Rodri (주장)",    "MF", "Manchester City" },
        {20, "Pedri",           "MF", "Barcelona" },
        {19, "Lamine Yamal",    "FW", "Barcelona" },
        {10, "Dani Olmo",       "FW", "Barcelona" },
    },
    // 7. 독일
    {
        { 1, "Manuel Neuer",          "GK", "Bayern Munich" },
        { 2, "Antonio Rudiger",       "DF", "Real Madrid" },
        { 6, "Joshua Kimmich (주장)", "DF", "Bayern Munich" },
        {10, "Jamal Musiala",         "MF", "Bayern Munich" },
        {17, "Florian Wirtz",         "MF", "Liverpool" },
        { 7, "Kai Havertz",           "FW", "Arsenal" },
    },
    // 8. 포르투갈
    {
        { 1, "Diogo Costa",              "GK", "Porto" },
        { 3, "Ruben Dias",               "DF", "Manchester City" },
        { 8, "Bruno Fernandes",          "MF", "Manchester United" },
        {10, "Bernardo Silva",           "MF", "Manchester City" },
        { 7, "Cristiano Ronaldo (주장)", "FW", "Al-Nassr" },
        {17, "Rafael Leao",              "FW", "Milan" },
    },
    // 9. 네덜란드
    {
        { 1, "Bart Verbruggen",        "GK", "Brighton & Hove Albion" },
        { 4, "Virgil van Dijk (주장)", "DF", "Liverpool" },
        {21, "Frenkie de Jong",        "MF", "Barcelona" },
        {10, "Memphis Depay",          "FW", "Corinthians" },
        {11, "Cody Gakpo",             "FW", "Liverpool" },
        {18, "Donyell Malen",          "FW", "Roma" },
    },
    // 10. 벨기에
    {
        { 1, "Thibaut Courtois",       "GK", "Real Madrid" },
        { 2, "Zeno Debast",            "DF", "Sporting CP" },
        { 7, "Kevin De Bruyne",        "MF", "Napoli" },
        { 9, "Romelu Lukaku",          "FW", "Napoli" },
        {11, "Jeremy Doku",            "FW", "Manchester City" },
        {10, "Leandro Trossard",       "FW", "Arsenal" },
    },
    // 11. 크로아티아
    {
        { 1, "Dominik Livakovic",  "GK", "Dinamo Zagreb" },
        { 4, "Josko Gvardiol",     "DF", "Manchester City" },
        { 8, "Mateo Kovacic",      "MF", "Manchester City" },
        {10, "Luka Modric (주장)", "MF", "Milan" },
        { 9, "Andrej Kramaric",    "FW", "TSG Hoffenheim" },
        {14, "Ivan Perisic",       "FW", "PSV Eindhoven" },
    },
};

void saekkal(int c) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), c);
}

void title() {
    int i;
    int colors[9] = {14, 11, 13, 11, 10, 11, 13, 11, 14};
    // 유니코드 박스 문자로 꾸민 타이틀 (화려하게ㅋㅋ)
    const char *lines[9] = {
        "  \xE2\x95\x94\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x97",
        "  \xE2\x95\x91                                              \xE2\x95\x91",
        "  \xE2\x95\x91    \xE2\x98\x85   P E N A L T Y   K I C K  !   \xE2\x98\x85      \xE2\x95\x91",
        "  \xE2\x95\x91                                              \xE2\x95\x91",
        "  \xE2\x95\x91           \xE2\x9A\xBD   F I F A   2 0 2 6   \xE2\x9A\xBD             \xE2\x95\x91",
        "  \xE2\x95\x91                                              \xE2\x95\x91",
        "  \xE2\x95\x91              \xED\x8C\xA8 \xEB\x84\xA4 \xED\x8B\xB0 \xED\x82\xA5 !!                    \xE2\x95\x91",
        "  \xE2\x95\x91                                              \xE2\x95\x91",
        "  \xE2\x95\x9A\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x90\xE2\x95\x9D",
    };
    printf("\n");
    for (i = 0; i < 9; i++) {
        saekkal(colors[i]);
        printf("%s\n", lines[i]);
    }
    printf("\n");
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

// 선수 명단 출력
void showRoster(int teamIdx, char nara[][20], char *gukgi[]) {
    int j;

    CLEAR_SCREEN();
    saekkal(YELLOW);
    printf("\n=== %s %s 선수 명단 (%d명) ===\n\n", gukgi[teamIdx], nara[teamIdx], PLAYER_SU);
    saekkal(WHITE);

    for (j = 0; j < PLAYER_SU; j++) {
        saekkal(j == 0 ? CYAN : WHITE);
        printf("  [%s] %2d. %-22s (%s)\n",
               roster[teamIdx][j].pos,
               roster[teamIdx][j].num,
               roster[teamIdx][j].name,
               roster[teamIdx][j].club);
    }
    printf("\n");

    saekkal(YELLOW);
    printf("아무 키나 누르면 게임 시작!!\n");
    saekkal(WHITE);
    _getch();
}

int main() {
    SetConsoleOutputCP(65001);
    srand((unsigned)time(NULL));

    char nara[NARA_SU][20] = {
        "한국", "일본", "브라질", "아르헨티나",
        "프랑스", "잉글랜드", "스페인", "독일",
        "포르투갈", "네덜란드", "벨기에", "크로아티아"
    };
    // 국기 이모지 (윈도우 터미널에서 뜸)
    char *gukgi[NARA_SU] = {
        "\xF0\x9F\x87\xB0\xF0\x9F\x87\xB7",  // 🇰🇷 한국
        "\xF0\x9F\x87\xAF\xF0\x9F\x87\xB5",  // 🇯🇵 일본
        "\xF0\x9F\x87\xA7\xF0\x9F\x87\xB7",  // 🇧🇷 브라질
        "\xF0\x9F\x87\xA6\xF0\x9F\x87\xB7",  // 🇦🇷 아르헨티나
        "\xF0\x9F\x87\xAB\xF0\x9F\x87\xB7",  // 🇫🇷 프랑스
        "\xF0\x9F\x8F\xB4",                   // 🏴 잉글랜드
        "\xF0\x9F\x87\xAA\xF0\x9F\x87\xB8",  // 🇪🇸 스페인
        "\xF0\x9F\x87\xA9\xF0\x9F\x87\xAA",  // 🇩🇪 독일
        "\xF0\x9F\x87\xB5\xF0\x9F\x87\xB9",  // 🇵🇹 포르투갈
        "\xF0\x9F\x87\xB3\xF0\x9F\x87\xB1",  // 🇳🇱 네덜란드
        "\xF0\x9F\x87\xA7\xF0\x9F\x87\xAA",  // 🇧🇪 벨기에
        "\xF0\x9F\x87\xAD\xF0\x9F\x87\xB7",  // 🇭🇷 크로아티아
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
    int shooterIdx;   // 1..5 (인덱스 0은 GK)
    int suddenIdx;

    CLEAR_SCREEN();
    title();
    printf("\n");
    saekkal(CYAN);
    printf("   아무 키나 눌러서 시작\n");
    saekkal(WHITE);
    _getch();
    CLEAR_SCREEN();

    // 나라선택
    title();
    printf("\n나라 선택 ㄱㄱ\n\n");
    for (i = 0; i < NARA_SU; i++) {
        printf("  %2d. %s %-12s  공격:%d  수비:%d\n",
               i + 1, gukgi[i], nara[i], gongGyeok[i], suBi[i]);
    }

    printf("\n번호 입력 (1~12) : ");
    scanf("%d", &me);

    if (me < 1 || me > 12) {
        printf("한국으로 함.\n");
        me = 1;
    }
    me = me - 1;

    // 선수 명단 보여주기
    showRoster(me, nara, gukgi);

    // 상대 나라 랜덤
    do {
        ai = rand() % NARA_SU;
    } while (ai == me);

    CLEAR_SCREEN();

    saekkal(YELLOW);
    printf("\n=========== 대결!! ===========\n");
    saekkal(WHITE);
    printf("\n   %s  VS  %s\n\n", nara[me], nara[ai]);
    printf("  내 나라    - 공격:%d  수비:%d\n", gongGyeok[me], suBi[me]);
    printf("  상대 나라  - 공격:%d  수비:%d\n", gongGyeok[ai], suBi[ai]);
    saekkal(YELLOW);
    printf("\n==============================\n");
    saekkal(WHITE);
    printf("\n상대팀 GK: %s | 우리팀 GK: %s\n", roster[ai][0].name, roster[me][0].name);
    printf("\n아무 키나 누르면 시작!!\n");
    _getch();

    // 승부차기
    for (round = 1; round <= 5; round++) {

        shooterIdx = round; // 1..5

        CLEAR_SCREEN();
        saekkal(CYAN);
        printf("\n====== %d번째 킥 ======\n\n", round);
        saekkal(WHITE);

        scoreBoard(nara[me], nara[ai], myScore, aiScore);

        // 내 공격
        saekkal(GREEN);
        printf(">>> 내 차례 (공격) <<<\n");
        saekkal(WHITE);
        printf("  슛터: %s %s (%s)\n",
               nara[me], roster[me][shooterIdx].name, roster[me][shooterIdx].pos);
        printf("  상대 키퍼: %s %s\n",
               nara[ai], roster[ai][0].name);
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

        printf("\n  %s 슛!!\n", roster[me][shooterIdx].name);
        Sleep(700);

        if (result == 1) {
            saekkal(GREEN);
            printf("\n  ★★ GOAL!! ★★\n");
            myScore++;
        } else if (myDir == aiBlock) {
            saekkal(RED);
            printf("\n  키퍼 %s의 놀라운 선방!\n", roster[ai][0].name);
        } else {
            saekkal(RED);
            printf("\n  %s의 실축!\n", roster[me][shooterIdx].name);
        }
        saekkal(WHITE);
        Sleep(1200);

        printf("\n아무 키나 눌러서 계속");
        _getch();
        CLEAR_SCREEN();

        // --- 상대 공격 ---
        saekkal(RED);
        printf("상대 공격 차례\n");
        saekkal(WHITE);
        printf("  상대 슛터: %s %s (%s)\n",
               nara[ai], roster[ai][shooterIdx].name, roster[ai][shooterIdx].pos);
        printf("  우리 키퍼: %s %s\n",
               nara[me], roster[me][0].name);

        scoreBoard(nara[me], nara[ai], myScore, aiScore);
        goalDraw();

        aiDir = rand() % 3;

        printf("슛 방향 선택\n");
        printf("  1. 왼쪽\n");
        printf("  2. 가운데\n");
        printf("  3. 오른쪽\n");
        printf(">> ");
        scanf("%d", &myBlock);
        if (myBlock < 1 || myBlock > 3) myBlock = 2;
        myBlock = myBlock - 1;

        if (aiDir == myBlock) {
            prob = gongGyeok[ai] - suBi[me] + 50;
            if (prob < 20) prob = 20;
            if (prob > 80) prob = 80;
            result = (rand() % 100 < prob) ? 1 : 0;
        } else {
            result = (rand() % 10 != 0) ? 1 : 0;
        }

        printf("\n  %s 슛!!\n", roster[ai][shooterIdx].name);
        Sleep(700);

        if (result == 1) {
            saekkal(RED);
            printf("\n  %s의 득점..\n", roster[ai][shooterIdx].name);
            aiScore++;
        } else if (aiDir == myBlock) {
            saekkal(GREEN);
            printf("\n  ★★ 키퍼 %s의 놀라운 선방! ★★\n", roster[me][0].name);
        } else {
            saekkal(GREEN);
            printf("\n  %s의 실축!\n", roster[ai][shooterIdx].name);
        }
        saekkal(WHITE);
        Sleep(1200);

        printf("\n아무 키나 눌러서 계속");
        _getch();
    }

    // 서든데스 (동점일때) - 인덱스 1~5 순환
    suddenIdx = 1;
    while (myScore == aiScore) {

        shooterIdx = suddenIdx;
        suddenIdx++;
        if (suddenIdx > 5) suddenIdx = 1;

        CLEAR_SCREEN();
        saekkal(RED);
        printf("\n\n  !! 서든데스 !!\n\n");
        saekkal(WHITE);
        Sleep(900);

        scoreBoard(nara[me], nara[ai], myScore, aiScore);

        // 내 슛
        printf("  슛터: %s %s (%s)\n",
               nara[me], roster[me][shooterIdx].name, roster[me][shooterIdx].pos);
        printf("  상대 키퍼: %s %s\n",
               nara[ai], roster[ai][0].name);
        goalDraw();
        printf("슛 방향 선택\n");
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
            saekkal(GREEN); printf("\n  %s GOAL!!\n", roster[me][shooterIdx].name); myScore++;
        } else {
            saekkal(RED); printf("\n  %s FAIL..\n", roster[me][shooterIdx].name);
        }
        saekkal(WHITE);
        Sleep(1100);

        // 상대 슛
        aiDir = rand() % 3;
        printf("\n 상대 슛터: %s %s\n", nara[ai], roster[ai][shooterIdx].name);
        printf(" 우리 키퍼: %s %s\n", nara[me], roster[me][0].name);
        printf("\n 막을 곳 선택 \n");
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
            saekkal(RED); printf("\n  %s의 득점..\n", roster[ai][shooterIdx].name); aiScore++;
        } else {
            saekkal(GREEN); printf("\n 키퍼 %s의 놀라운 선방!!\n", roster[me][0].name);
        }
        saekkal(WHITE);
        Sleep(1100);
    }

    // 최종결과
    CLEAR_SCREEN();
    title();
    printf("\n");
    scoreBoard(nara[me], nara[ai], myScore, aiScore);

    if (myScore > aiScore) {
        saekkal(GREEN);
        printf("  ★★★ WIN!! ★★★\n");
        printf("  %s 우승", nara[me]);
    } else {
        saekkal(RED);
        printf("패배\n");
    }
    saekkal(WHITE);

    printf("\n\n아무 키나 눌러서 종료\n");
    _getch();

    return 0;
}
