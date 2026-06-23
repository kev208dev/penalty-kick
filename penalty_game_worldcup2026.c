#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

int N = 12, M = 6;

char tn[12][30] = {
    "한국","일본","브라질","아르헨티나","프랑스","잉글랜드",
    "스페인","독일","포르투갈","네덜란드","벨기에","크로아티아"
};
int atk[12] = {80,78,95,93,92,91,89,90,88,85,84,82};
int def[12] = {82,80,88,85,90,87,88,91,84,86,83,85};

char pn[12][6][40] = {
    {"김승규","김민재","이재성","황희찬","이강인","손흥민"},
    {"Zion Suzuki","Ko Itakura","Takefusa Kubo","Ritsu Doan","Daichi Kamada","Ayase Ueda"},
    {"Alisson","Marquinhos","Casemiro","Vinicius Jr","Neymar","Raphinha"},
    {"E. Martinez","C. Romero","E. Fernandez","J. Alvarez","L. Messi","L. Martinez"},
    {"M. Maignan","D. Upamecano","A. Tchouameni","O. Dembele","K. Mbappe","M. Olise"},
    {"J. Pickford","J. Stones","D. Rice","J. Bellingham","B. Saka","H. Kane"},
    {"D. Raya","A. Laporte","Rodri","Pedri","L. Yamal","D. Olmo"},
    {"M. Neuer","A. Rudiger","J. Kimmich","J. Musiala","F. Wirtz","K. Havertz"},
    {"D. Costa","R. Dias","B. Fernandes","B. Silva","C. Ronaldo","R. Leao"},
    {"B. Verbruggen","V. van Dijk","F. de Jong","M. Depay","C. Gakpo","D. Malen"},
    {"T. Courtois","Z. Debast","K. De Bruyne","R. Lukaku","J. Doku","L. Trossard"},
    {"D. Livakovic","J. Gvardiol","M. Kovacic","L. Modric","A. Kramaric","I. Perisic"}
};

int getDir(const char *msg) {
    int x, c;
    while (1) {
        printf("%s", msg);
        if (scanf("%d", &x) == 1 && x >= 1 && x <= 3) return x - 1;
        while ((c = getchar()) != '\n' && c != EOF);
        printf("1, 2, 3 중에서만 입력!\n");
    }
}

int judge(int shot, int guess, int atk_v, int def_v) {
    int p;
    if (shot == guess) {
        p = atk_v - def_v + 30;
        if (p < 10) p = 10;
        if (p > 55) p = 55;
        return (rand() % 100) < p ? 1 : 0;
    }
    return (rand() % 10) != 0 ? 1 : 0;
}

int pickMe() {
    int me, i;
    for (i = 0; i < N; i++) {
        printf("%2d. %-12s 공:%d 수:%d\n", i + 1, tn[i], atk[i], def[i]);
    }
    printf("13. 얼굴인식\n");
    printf(">> ");
    if (scanf("%d", &me) != 1) me = 1;

    if (me == 13) {
        printf("\n얼굴인식 중입니다");
        fflush(stdout);
        for (i = 0; i < 5; i++) {
            sleep(1);
            printf(".");
            fflush(stdout);
        }
        sleep(1);
        printf("\n한국인입니다!\n");
        sleep(1);
        printf("한국팀이 선택됩니다.\n\n");
        me = 1;
    }
    if (me < 1 || me > 12) me = 1;
    return me - 1;
}

int playMyTurn(int r, int me, int ai) {
    int md, ab;
    printf("\n우리 슈터: %s | 상대 GK: %s\n", pn[me][r], pn[ai][0]);
    md = getDir("슛 방향(왼:1, 가운데:2, 오른:3) >> ");
    ab = rand() % 3;
    if (judge(md, ab, atk[me], def[ai])) { 
        printf("GOAL!\n"); 
        return 1; 
    }
    else if (md == ab) printf("%s 선방!\n", pn[ai][0]);
    else printf("%s 실축!\n", pn[me][r]);
    return 0;
}

int playAiTurn(int r, int me, int ai) {
    int ad, mb;
    printf("\n상대 슈터: %s | 우리 GK: %s\n", pn[ai][r], pn[me][0]);
    ad = rand() % 3;
    mb = getDir("막을 방향(왼:1, 가운데:2, 오른:3) >> ");
    if (judge(ad, mb, atk[ai], def[me])) { 
        printf("실점..\n"); 
        return 1; 
    }
    else if (ad == mb) printf("%s 선방!!\n", pn[me][0]);
    else printf("%s 실축!\n", pn[ai][r]);
    return 0;
}

void result(int me, int ai, int ms, int as) {
    printf("=== 최종 ===\n");
    printf("%s %d : %d %s\n", tn[me], ms, as, tn[ai]);
    if (ms > as) printf("%s 승!\n", tn[me]);
    else printf("%s 승\n", tn[ai]);
}

int main() {
    srand((unsigned)time(NULL));

    int me, ai;
    int ms = 0, as = 0;
    int r, i;
    int sd = 1;

    me = pickMe();

    printf("\n[%s 선수]\n", tn[me]);
    for (i = 0; i < M; i++) {
        printf("%d. %s%s\n", i + 1, pn[me][i], i == 0 ? " (GK)" : "");
    }

    do { ai = rand() % N; } while (ai == me);

    printf("\n%s vs %s\n", tn[me], tn[ai]);
    printf("우리 GK: %s | 상대 GK: %s\n\n", pn[me][0], pn[ai][0]);

    for (r = 1; r <= 5; r++) {
        printf("=== %d라운드 ===\n", r);
        printf("점수 %d : %d\n", ms, as);
        ms += playMyTurn(r, me, ai);
        as += playAiTurn(r, me, ai);
        printf("\n");
    }

    while (ms == as) {
        printf("=== 서든데스 ===\n");
        printf("점수 %d : %d\n", ms, as);
        ms += playMyTurn(sd, me, ai);
        as += playAiTurn(sd, me, ai);
        printf("\n");

        sd++;
        if (sd > 5) sd = 1;
    }

    result(me, ai, ms, as);

    return 0;
}