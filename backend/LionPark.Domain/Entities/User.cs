namespace LionPark.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; }
    public string Cpf { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string Role { get; private set; }
    public string PlanType { get; private set; }
    public int PaymentDay { get; private set; }
    public bool IsActive { get; private set; }

    public ICollection<Vehicle> Vehicles { get; private set; } = new List<Vehicle>();

    public User(string fullName, string cpf, string email, string passwordHash, string role, string planType = "Padrão", int paymentDay = 10)
    {
        Id = Guid.NewGuid();
        FullName = fullName;
        Cpf = cpf;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        PlanType = planType;
        PaymentDay = paymentDay;
        IsActive = true;
    }

    public void UpdateCustomerInfo(string fullName, string cpf, string email, string planType, int paymentDay)
    {
        FullName = fullName;
        Cpf = cpf;
        Email = email;
        PlanType = planType;
        PaymentDay = paymentDay;
    }

    public void AnonymizeData()
    {
        FullName = "Anônimo";
        Cpf = "00000000000";
        Email = $"{Guid.NewGuid()}@deleted.com";
        IsActive = false;
    }
}