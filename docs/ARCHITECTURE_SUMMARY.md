

### 1. System Context Diagram (Діаграма контексту системи)

```mermaid
graph TB
    User[👤 Користувач<br/>Web/Mobile Client]
    
    subgraph "Finance Tracker AI Backend"
        API[NestJS API<br/>REST Endpoints]
    end
    
    DB[(PostgreSQL<br/>Основна БД)]
    Cache[(Redis<br/>Кеш + Сесії)]
    OpenAI[OpenAI API<br/>GPT-4]
    Currency[Currency API<br/>Курси валют]
    Email[Email Service<br/>Nodemailer]
    
    User -->|HTTP/HTTPS| API
    API -->|Prisma ORM| DB
    API -->|Read/Write| Cache
    API -->|AI Analysis| OpenAI
    API -->|Exchange Rates| Currency
    API -->|Notifications| Email
    
    style User fill:#FFE6E6
    style API fill:#B3D9FF
    style DB fill:#C7E9C0
    style Cache fill:#FFD699
    style OpenAI fill:#E6B3CC
    style Currency fill:#E6B3CC
    style Email fill:#E6B3CC
```

### 2.2. High-Level Architecture (Високорівнева архітектура)

```mermaid
graph TB
    subgraph "Client Layer"
        Client[Web/Mobile Client]
    end
    
    subgraph "API Gateway"
        Gateway[NestJS Application<br/>Port: 3000]
    end
    
    subgraph "Business Modules"
        Auth[ Auth Module<br/>Authentication & Authorization]
        Trans[ Transaction Module<br/>Income & Expenses]
        Cat[ Category Module<br/>Categories Management]
        Budget[ Budget Module<br/>Budget Tracking & Alerts]
        AI[ AI Assistant Module<br/>Financial Analysis]
        Report[ Report Module<br/>PDF Generation]
    end
    
    subgraph "Infrastructure Modules"
        Logger[ Logger Module<br/>Winston/Pino]
        Config[ Config Module<br/>Environment Variables]
        DBModule[ Database Module<br/>Prisma Client]
        CacheModule[ Cache Module<br/>Redis Client]
    end
    
    subgraph "Data Storage"
        PG[(PostgreSQL<br/>Users, Transactions<br/>Budgets, Categories)]
        Redis[(Redis<br/>Sessions, Cache<br/>Rate Limiting)]
    end
    

    Client -->|REST API| Gateway

    Gateway --> Auth
    Gateway --> Trans
    Gateway --> Cat
    Gateway --> Budget
    Gateway --> AI
    Gateway --> Report

    Auth --> DBModule
    Trans --> DBModule
    Cat --> DBModule
    Budget --> DBModule
    AI --> DBModule
    Report --> DBModule

    Auth --> CacheModule

    %% Кожен сервіс використовує Logger і Config
    Auth --> Logger
    Trans --> Logger
    Cat --> Logger
    Budget --> Logger
    AI --> Logger
    Report --> Logger

    Auth --> Config
    Trans --> Config
    Cat --> Config
    Budget --> Config
    AI --> Config
    Report --> Config

    DBModule --> PG
    CacheModule --> Redis

    
    style Client fill:#FFE6E6
    style Gateway fill:#B3D9FF
    style Auth fill:#C7E9C0
    style Trans fill:#C7E9C0
    style Cat fill:#C7E9C0
    style Budget fill:#C7E9C0
    style AI fill:#C7E9C0
    style Report fill:#C7E9C0
    style PG fill:#FFD699
    style Redis fill:#FFD699
```

### 2. Модулі системи

#### Бізнес-модулі (Business Modules):

1. **Auth Module** 
   - Реєстрація користувачів
   - Вхід в систему (JWT tokens)
   - Управління сесіями (Redis)
   - Верифікація email

2. **Transaction Module** 
   - CRUD операції з транзакціями
   - Фільтрація та пошук
   - Конвертація валют
   - Історія операцій

3. **Category Module** 
   - Управління категоріями витрат/доходів
   - Дефолтні категорії
   - Користувацькі категорії
   - Статистика по категоріях

4. **Budget Module** 
   - Створення та управління бюджетами
   - Відстеження витрат
   - Автоматичні сповіщення (email)
   - Прогнозування витрат

5. **AI Assistant Module** 
   - Аналіз фінансової поведінки
   - Виявлення паттернів витрат
   - Генерація рекомендацій (OpenAI GPT-4)
   - Чат-інтерфейс для питань

6. **Report Module** 
   - Генерація PDF звітів
   - Статистика за період
   - Візуалізація даних

#### Інфраструктурні модулі (Infrastructure Modules):

7. **Logger Module** 
   - Структуроване логування (Winston/Pino)
   - Різні рівні логування (error, warn, info, debug)
   - Збереження логів у файли

8. **Config Module** 
   - Управління environment змінними
   - Валідація конфігурації
   - Типобезпечний доступ до налаштувань

9. **Database Module** 
   - Prisma Client для PostgreSQL
   - Міграції схеми бази даних
   - Connection pooling

10. **Cache Module** 
    - Redis client для кешування
    - Управління сесіями
    - Rate limiting

### 2.4. Протоколи та інтерфейси взаємодії

| Взаємодія | Протокол | Формат даних |
|-----------|----------|--------------|
| Client ↔ API | HTTP/HTTPS (REST) | JSON |
| API ↔ PostgreSQL | TCP (Prisma) | SQL |
| API ↔ Redis | TCP (ioredis) | Key-Value |
| API ↔ OpenAI | HTTPS (REST) | JSON |
| API ↔ Currency API | HTTPS (REST) | JSON |
| API ↔ Email | SMTP | Email |

---

## 3. Деталізоване проектування компонентів

### 3.1. Class Diagram - Domain Model (Діаграма класів - Доменна модель)


```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String passwordHash
        +String firstName
        +String lastName
        +Boolean isEmailVerified
        +Date createdAt
        +Date updatedAt
    }
    
    class Session {
        +String id
        +String userId
        +String token
        +String refreshToken
        +Date expiresAt
        +String ipAddress
        +String userAgent
        +Date createdAt
    }
    
    class Category {
        +String id
        +String userId
        +String name
        +CategoryType type
        +String color
        +String icon
        +Boolean isDefault
        +Date createdAt
    }
    
    class Transaction {
        +String id
        +String userId
        +String categoryId
        +TransactionType type
        +Decimal amount
        +String currency
        +String description
        +Date date
        +Date createdAt
        +Date updatedAt
    }
    
    class Budget {
        +String id
        +String userId
        +String categoryId
        +Decimal limitAmount
        +String limitCurrency
        +Decimal spentAmount
        +BudgetPeriod period
        +Date startDate
        +Date endDate
        +Decimal alertThreshold
        +Date createdAt
    }
    
    class FinancialAnalysis {
        +String id
        +String userId
        +Date startDate
        +Date endDate
        +JSON insights
        +JSON recommendations
        +Date createdAt
    }
    
    class ChatMessage {
        +String id
        +String userId
        +MessageRole role
        +String content
        +Date timestamp
    }
    
    User "1" --o "*" Session : має
    User "1" --o "*" Category : створює
    User "1" --o "*" Transaction : виконує
    User "1" --o "*" Budget : встановлює
    User "1" --o "*" FinancialAnalysis : отримує
    User "1" --o "*" ChatMessage : відправляє
    
    Category "1" --o "*" Transaction : категоризує
    Category "1" --o "*" Budget : обмежує
```

**Пояснення відносин:**
- `User` є центральною сутністю системи
- Один `User` може мати багато `Transaction`, `Budget`, `Category`
- `Transaction` належить до однієї `Category`
- `Budget` встановлюється для однієї `Category`

#### Enums (Перерахування):

```mermaid
classDiagram
    class TransactionType {
        <<enumeration>>
        INCOME
        EXPENSE
    }
    
    class CategoryType {
        <<enumeration>>
        FOOD
        TRANSPORT
        ENTERTAINMENT
        UTILITIES
        SHOPPING
        EDUCATION
        HEALTH
        SALARY
        INVESTMENT
        OTHER
    }
    
    class BudgetPeriod {
        <<enumeration>>
        DAILY
        WEEKLY
        MONTHLY
        YEARLY
    }
    
    class MessageRole {
        <<enumeration>>
        USER
        ASSISTANT
    }
```

### 3.2. Sequence Diagram - User Registration (Діаграма послідовності - Реєстрація користувача)

```mermaid
sequenceDiagram
    actor User
    participant Controller as AuthController
    participant Service as AuthService
    participant Repo as UserRepository
    participant DB as PostgreSQL
    participant Logger as LoggerService
    
    User->>+Controller: POST /auth/register<br/>{email, password, firstName, lastName}
    
    Controller->>+Logger: log("Registration attempt for {email}")
    Logger-->>-Controller: ✓
    
    Controller->>Controller: Validate DTO
    
    Controller->>+Service: register(registerDto)
    
    Service->>+Repo: findByEmail(email)
    Repo->>+DB: SELECT * FROM users WHERE email = ?
    DB-->>-Repo: null (not exists)
    Repo-->>-Service: null
    
    Service->>Service: Hash password (bcrypt)
    
    Service->>+Repo: create({email, passwordHash, ...})
    Repo->>+DB: INSERT INTO users VALUES (...)
    DB-->>-Repo: User created
    Repo-->>-Service: UserEntity
    
    Service->>+Logger: log("User registered: {userId}")
    Logger-->>-Service: ✓
    
    Service-->>-Controller: UserEntity
    
    Controller->>Controller: Map to UserResponseDto
    Controller-->>-User: 201 Created<br/>{id, email, firstName, lastName}
```

### 3.3. Sequence Diagram - Create Transaction with Budget Check (Діаграма послідовності - Створення транзакції з перевіркою бюджету)


```mermaid
sequenceDiagram
    actor User
    participant Controller as TransactionController
    participant TService as TransactionService
    participant TRepo as TransactionRepository
    participant BService as BudgetService
    participant BRepo as BudgetRepository
    participant Email as EmailService
    participant DB as PostgreSQL
    
    User->>+Controller: POST /transactions<br/>{type: EXPENSE, amount, categoryId}
    
    Controller->>+TService: createTransaction(dto, userId)
    
    TService->>+TRepo: create({userId, type, amount, categoryId})
    TRepo->>+DB: INSERT INTO transactions
    DB-->>-TRepo: Transaction created
    TRepo-->>-TService: TransactionEntity
    
    alt Transaction is EXPENSE
        TService->>+BService: checkBudget(userId, categoryId, amount)
        
        BService->>+BRepo: findActiveByCategory(userId, categoryId)
        BRepo->>+DB: SELECT * FROM budgets WHERE...
        DB-->>-BRepo: Budget found
        BRepo-->>-BService: BudgetEntity
        
        BService->>BService: Calculate new spent amount
        
        alt Budget exceeded
            BService->>+Email: sendBudgetAlert(user, budget, category)
            Email-->>-BService: Email sent
            
            BService->>+BRepo: updateSpent(budgetId, newAmount)
            BRepo->>+DB: UPDATE budgets SET spent = ?
            DB-->>-BRepo: Updated
            BRepo-->>-BService: ✓
        end
        
        BService-->>-TService: Budget checked
    end
    
    TService-->>-Controller: TransactionEntity
    Controller-->>-User: 201 Created<br/>Transaction details
```

### 3.4. Sequence Diagram - AI Financial Analysis (Діаграма послідовності - AI аналіз фінансів)


```mermaid
sequenceDiagram
    actor User
    participant Controller as AIController
    participant Service as AIService
    participant TRepo as TransactionRepository
    participant BRepo as BudgetRepository
    participant Cache as Redis
    participant OpenAI as OpenAI API
    participant ARepo as AnalysisRepository
    participant DB as PostgreSQL
    
    User->>+Controller: POST /ai/analyze<br/>{startDate, endDate}
    
    Controller->>+Service: generateAnalysis(userId, period)
    
    Service->>+Cache: GET analysis:{userId}:{period}
    Cache-->>-Service: null (cache miss)
    
    Service->>+TRepo: findByDateRange(userId, startDate, endDate)
    TRepo->>+DB: SELECT * FROM transactions WHERE...
    DB-->>-TRepo: transactions[]
    TRepo-->>-Service: TransactionEntity[]
    
    Service->>+BRepo: findByUserId(userId)
    BRepo->>+DB: SELECT * FROM budgets WHERE userId = ?
    DB-->>-BRepo: budgets[]
    BRepo-->>-Service: BudgetEntity[]
    
    Service->>Service: Analyze spending patterns<br/>Calculate statistics<br/>Detect anomalies
    
    Service->>+OpenAI: POST /v1/chat/completions<br/>{model: "gpt-4", messages: [...]}
    OpenAI-->>-Service: AI recommendations
    
    Service->>+ARepo: save(analysis)
    ARepo->>+DB: INSERT INTO financial_analyses
    DB-->>-ARepo: Analysis saved
    ARepo-->>-Service: AnalysisEntity
    
    Service->>+Cache: SET analysis:{userId}:{period} (TTL: 1h)
    Cache-->>-Service: ✓
    
    Service-->>-Controller: AnalysisEntity
    Controller-->>-User: 200 OK<br/>{insights, recommendations}
```

### 3.5. State Diagram - Budget Lifecycle (Діаграма станів - Життєвий цикл бюджету)


```mermaid
stateDiagram-v2
    [*] --> Created: User creates budget
    
    Created --> Active: Start date reached
    
    Active --> Warning: Spent > 80% of limit
    Active --> Exceeded: Spent > limit
    Active --> Completed: End date reached
    
    Warning --> Exceeded: Spent > limit
    Warning --> Completed: End date reached
    
    Exceeded --> Completed: End date reached
    
    Completed --> [*]: Budget archived
    
    note right of Created
        Budget is created
        but not yet active
    end note
    
    note right of Active
        Normal spending
        tracking active
    end note
    
    note right of Warning
        Email alert sent
        User notified
    end note
    
    note right of Exceeded
        Email alert sent
        Budget limit exceeded
    end note
    
    note right of Completed
        Budget period ended
        Ready for archiving
    end note
```
