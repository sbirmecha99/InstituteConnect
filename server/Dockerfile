# Build stage
FROM golang:1.23 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM gcr.io/distroless/static-debian11
WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/uploads ./uploads

EXPOSE 3000
CMD ["./main"]
