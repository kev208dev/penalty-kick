#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>
#include <conio.h>

#define RED    12
#define GREEN  10
#define YELLOW 14
#define CYAN   11
#define WHITE   7
#define PINK   13

#define NARA_SU 6  

void saekkal(int c) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), c);
}

// 타이틀 화면 출력
void title() {
    saekkal(YELLOW);
    printf("=========================================\n");
    printf("           패  널  티  킥  !!!!          \n");
    printf("=========================================\n");
    saekkal(WHITE);
}

//
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

// 점수판
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

int main() {
    SetConsoleOutputCP(65001);  // 한글 깨질때
    srand(time(NULL));

    // 나라 목록, 능력치
    char nara[NARA_SU][20] = {
        "브라질", "프랑스", "한국",
        "독일", "아르헨티나", "일본"
    };
    int gongGyeok[NARA_SU] = { 95, 92, 80, 90, 93, 78 };  // 공격력
    int suBi[NARA_SU]      = { 88, 90, 82, 91, 85, 80 };  // 수비력

    int me, ai;
    int i;
    int myScore = 0, aiScore = 0;
    int myDir, aiDir;       // 방향 0=왼 1=중 2=오
    int myBlock, aiBlock;   // 막는 방향
    int result;             // 1=성공 0=실패
    int prob;               // 확률
    int round;              // 몇번째 킥

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
        printf("  %d. %-12s  공격:%d  수비:%d\n",
               i + 1, nara[i], gongGyeok[i], suBi[i]);
    }
    printf("\n번호 입력 : ");
    scanf("%d", &me);

    if (me < 1 || me > 6) {
        printf("잘못 눌렀음 -> 한국으로 할게\n");
        me = 3;
    }
    me = me - 1;  // 배열은 0부터니까

    // 상대 나라 랜덤
    do {
        ai = rand() % NARA_SU;
    } while (ai == me);  // 나랑 같으면 다시뽑기

    system("cls");

    // 대결 소개
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
        if (myDir < 1 || myDir > 3) myDir = 2;  // 이상한거 누르면 가운데
        myDir = myDir - 1;

        aiBlock = rand() % 3;  // 상대 키퍼 방향 (랜덤)

        // 결과 계산 (능력치 차이로 확률 만듬)
        if (myDir == aiBlock) {
            prob = gongGyeok[me] - suBi[ai] + 50;
            if (prob < 20) prob = 20;
            if (prob > 80) prob = 80;
            result = (rand() % 100 < prob) ? 1 : 0;
        } else {
            // 방향 다르면 거의 골 (10%는 실축)
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

        aiDir = rand() % 3;  // 상대 슛 방향

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

    // 서든데스(동점일때)
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
        printf("  졌다...ㅠㅠ\n");
        printf("  다음엔 꼭 이긴다!\n");
    }
    saekkal(WHITE);

    printf("\n\n아무 키나 눌러서 종료\n");
    _getch();

    return 0;
}
