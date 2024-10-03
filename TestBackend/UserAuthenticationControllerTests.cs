using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using FinalVirtualBot.Server.Controllers;
using FinalVirtualBot.Server.Dtos;
using FinalVirtualBot.Server.Models;
using FluentAssertions;
using System.Dynamic;
using Microsoft.AspNetCore.Http;

namespace TestBackend
{
    public class UserAuthenticationControllerTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly Mock<RoleManager<ApplicationRole>> _roleManagerMock;
        private readonly UserAuthenticationController _controller;

        public UserAuthenticationControllerTests()
        {
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(
                Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null);

            _roleManagerMock = new Mock<RoleManager<ApplicationRole>>(
                Mock.Of<IRoleStore<ApplicationRole>>(), null, null, null, null);

            // Initialize the controller
            _controller = new UserAuthenticationController(_userManagerMock.Object, _roleManagerMock.Object);
        }

        [Fact]
        public async Task Register_ShouldReturnError_WhenUserAlreadyExists()
        {
            // Arrange
            var request = new RegisterRequest { Email = "test@example123.com", Password = "Password123!" };
            _userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                            .ReturnsAsync(new ApplicationUser { Email = request.Email });

            // Act
            var result = await _controller.Register(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("User already exists", badRequestResult.Value);
        }

        [Fact]
        public async Task Register_ShouldReturnSuccess_WhenUserIsCreated()
        {
            // Arrange
            var request = new RegisterRequest { Email = "newuser@example.com", Password = "Password12" };
            _userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                            .ReturnsAsync((ApplicationUser)null); // No existing user

            _userManagerMock.Setup(u => u.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                            .ReturnsAsync(IdentityResult.Success); // Simulate successful user creation

            _userManagerMock.Setup(u => u.AddToRoleAsync(It.IsAny<ApplicationUser>(), "USER"))
                            .ReturnsAsync(IdentityResult.Success); // Simulate adding user to "USER" role

            // Act
            var result = await _controller.Register(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<RegisterResponse>(okResult.Value);
            Assert.True(response.Success);
            Assert.Equal("User registered successfully", response.Message);
        }

        [Fact]
        public async Task Register_ShouldReturnError_WhenExceptionOccurs()
        {
            // Arrange
            var request = new RegisterRequest { Email = "exceptionuser@example.com", Password = "Password123!" };
            _userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                            .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.Register(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Database error", badRequestResult.Value);
        }

        [Fact]
        public async Task Login_ShouldReturnError_WhenUserNotFound()
        {
            // Arrange
            var request = new LoginRequest { Email = "nonexistent@example.com", Password = "Password123" };
            _userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                            .ReturnsAsync((ApplicationUser)null); // Simulate no user found

            // Act
            var result = await _controller.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid email/password", badRequestResult.Value);
        }

        [Fact]
        public async Task Login_ShouldReturnAccessToken_WhenCredentialsAreValid()
        {
            // Arrange
            var request = new LoginRequest { Email = "validuser@example.com", Password = "Password123!" };
            var user = new ApplicationUser { Email = request.Email, UserName = request.Email };

            _userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                            .ReturnsAsync(user); // Simulate valid user

            _userManagerMock.Setup(u => u.CheckPasswordAsync(user, request.Password))
                            .ReturnsAsync(true); // Simulate valid password

            _userManagerMock.Setup(u => u.GetRolesAsync(user))
                            .ReturnsAsync(new List<string> { "USER" }); // Simulate user role

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<LoginResponse>(okResult.Value);
            response.Should().NotBeNull();
            response.AccessToken.Should().NotBeNullOrEmpty();
            response.Success.Should().BeTrue();
        }

        [Fact]
        public async Task Login_ShouldReturnError_WhenExceptionOccurs()
        {
            // Arrange
            var request = new LoginRequest { Email = "exceptionuser@example.com", Password = "Password123!" };
            _userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                            .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Database error", badRequestResult.Value);
        }
        [Fact]
        public async Task CreateRole_ShouldReturnSuccess_WhenRoleIsCreated()
        {
            // Arrange
            var request = new CreateRoleRequest { Role = "USER" };
            _roleManagerMock.Setup(r => r.CreateAsync(It.IsAny<ApplicationRole>()))
                            .ReturnsAsync(IdentityResult.Success); // Simulate successful role creation

            // Act
            // Act
            var result = await _controller.CreateRole(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value;
            var message = response.GetType().GetProperty("message")?.GetValue(response);
            message.Should().Be("role created succesfully");


        }



        [Fact]
        public async Task CreateRole_ShouldReturnError_WhenExceptionOccurs()
        {
            // Arrange
            var request = new CreateRoleRequest { Role = "Admin" };
            _roleManagerMock.Setup(r => r.CreateAsync(It.IsAny<ApplicationRole>()))
                            .ThrowsAsync(new Exception("Role creation failed"));

            // Act
            var result = await _controller.CreateRole(request);

            //// Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = badRequestResult.Value;
            var message = response.GetType().GetProperty("Message")?.GetValue(response);
            Assert.Equal("Role creation failed", message);
        }
    }
}
