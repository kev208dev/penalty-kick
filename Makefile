CC     = gcc
CFLAGS = -Wall -Wextra -std=c11
TARGET = agent

# Windows MSYS2/MinGW -> ncursesw, Linux/Mac -> ncurses
UNAME := $(shell uname -s 2>/dev/null || echo Windows)
ifneq (,$(findstring MINGW,$(UNAME)))
    LIBS = -lncursesw
else ifneq (,$(findstring MSYS,$(UNAME)))
    LIBS = -lncursesw
else
    LIBS = -lncurses
endif

all: $(TARGET)

$(TARGET): cli.c
	$(CC) $(CFLAGS) cli.c -o $(TARGET) $(LIBS)

clean:
	rm -f $(TARGET)

.PHONY: all clean
