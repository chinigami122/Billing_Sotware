package in.bouziani.billingsoftwar;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Hello! My Spring Boot backend is successfully running!";
    }
}